"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { MessageCircleQuestionMark } from "lucide-react";
import { InlineText } from "@/components/course/InlineText";

const TOOLTIP_WIDTH = 288;
const GAP = 10;
const EDGE = 12;
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Only one explanation may stay pinned at a time, so opening a second term
 * does not leave the first one hanging on the screen.
 */
let dismissPinned: (() => void) | null = null;

function subscribeToHover(callback: () => void) {
  const query = window.matchMedia(HOVER_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getHoverSnapshot() {
  return window.matchMedia(HOVER_QUERY).matches;
}

/** Assume a pointer on the server; the client corrects it on hydration. */
function getServerHoverSnapshot() {
  return true;
}

/**
 * A glossary term inside stage text.
 *
 * The explanation sits in a portal on `document.body` rather than inside the
 * stage, because the stage content is animated with a `transform`, which
 * would otherwise become the anchor for a fixed-position tooltip and send it
 * to the wrong place.
 */
export function GlossaryTerm({
  term,
  explanation,
  children,
}: {
  term: string;
  explanation: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const pressedWhilePinned = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowAboveRef = useRef<HTMLSpanElement>(null);
  const arrowBelowRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const canHover = useSyncExternalStore(
    subscribeToHover,
    getHoverSnapshot,
    getServerHoverSnapshot,
  );

  const hide = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, []);

  /**
   * Positions the tooltip over the term. The size is written straight to the
   * element rather than held in state, so opening a term never triggers a
   * second render of the whole stage.
   */
  const place = useCallback(() => {
    const button = buttonRef.current;
    const tooltip = tooltipRef.current;
    if (!button || !tooltip) return;

    const buttonBox = button.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const height = tooltipBox.height || 120;

    let left = buttonBox.left + buttonBox.width / 2 - TOOLTIP_WIDTH / 2;
    left = Math.max(EDGE, Math.min(left, window.innerWidth - TOOLTIP_WIDTH - EDGE));

    let above = true;
    let top = buttonBox.top - height - GAP;
    if (top < EDGE) {
      above = false;
      top = buttonBox.bottom + GAP;
    }
    if (top + height > window.innerHeight - EDGE) {
      top = Math.max(EDGE, window.innerHeight - height - EDGE);
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.opacity = "1";

    const centre = buttonBox.left + buttonBox.width / 2 - left;
    const arrowLeft = Math.min(Math.max(centre, 16), TOOLTIP_WIDTH - 16) - 5;

    if (arrowAboveRef.current) {
      arrowAboveRef.current.style.left = `${arrowLeft}px`;
      arrowAboveRef.current.style.display = above ? "block" : "none";
    }
    if (arrowBelowRef.current) {
      arrowBelowRef.current.style.left = `${arrowLeft}px`;
      arrowBelowRef.current.style.display = above ? "none" : "block";
    }
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    let frame = 0;

    /**
     * The tooltip follows the term as the page scrolls, and closes once the
     * term has left the screen. Clicking a term that was below the fold
     * scrolls it into view, so closing on every scroll would kill the
     * tooltip the moment it opened.
     */
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const button = buttonRef.current;
        if (!button) return;
        const box = button.getBoundingClientRect();
        if (box.bottom <= 0 || box.top >= window.innerHeight) {
          hide();
          return;
        }
        place();
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      hide();
      buttonRef.current?.focus();
    };

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, place, hide]);

  useEffect(() => {
    return () => {
      if (dismissPinned === hide) dismissPinned = null;
    };
  }, [hide]);

  const tooltip =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            style={{
              left: 0,
              top: 0,
              width: TOOLTIP_WIDTH,
            }}
            className="fixed z-[100] rounded-xl border border-border bg-card p-3.5 text-left opacity-0 shadow-2xl transition-opacity duration-150"
          >
            <span
              ref={arrowAboveRef}
              aria-hidden="true"
              className="absolute -top-[6px] h-2.5 w-2.5 rotate-45 border-b border-r border-border bg-card"
            />
            <span
              ref={arrowBelowRef}
              aria-hidden="true"
              className="absolute -bottom-[6px] hidden h-2.5 w-2.5 rotate-45 border-l border-t border-border bg-card"
            />
            <p className="font-mono text-[11px] font-semibold tracking-wide text-primary">
              {term}
            </p>
            <p className="mt-1.5 text-xs leading-[1.6] text-foreground">
              <InlineText text={explanation} />
            </p>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onPointerEnter={
          canHover
            ? () => {
                if (!pinned) setOpen(true);
              }
            : undefined
        }
        onPointerLeave={
          canHover
            ? () => {
                if (!pinned) setOpen(false);
              }
            : undefined
        }
        onPointerDown={() => {
          // Opening on pointerdown rather than on click means the bubble
          // appears the moment the term is pressed, with no wait for the
          // click, and it does not depend on the order in which the browser
          // fires focus and blur.
          pressedWhilePinned.current = pinned;
          if (dismissPinned) dismissPinned();
          dismissPinned = hide;
          setOpen(true);
          setPinned(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={hide}
        onClick={() => {
          // A second press on a term that is already pinned puts it away
          // again.
          if (pressedWhilePinned.current) hide();
        }}
        className="group inline-flex cursor-help items-baseline gap-[3px] rounded border-0 bg-transparent p-0 font-inherit text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="underline decoration-dotted decoration-primary/70 decoration-2 underline-offset-[3px] transition-colors group-hover:decoration-primary">
          {children}
        </span>
        <MessageCircleQuestionMark
          aria-hidden="true"
          className="h-3 w-3 shrink-0 self-center text-primary/70 transition-colors group-hover:text-primary"
        />
      </button>
      {tooltip}
    </>
  );
}
