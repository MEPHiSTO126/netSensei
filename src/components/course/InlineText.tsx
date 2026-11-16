"use client";

import { Fragment, type ComponentType, type ReactNode } from "react";
import { splitByGlossaryTerms, type GlossaryEntry } from "@/lib/glossary";

const CODE_CLASS =
  "rounded-md bg-primary/[0.08] text-primary border border-primary/15 px-1.5 py-0.5 font-mono text-xs";

/** How a glossary term is drawn. Supplied by the caller, so this module
 *  never has to know about the tooltip and the tooltip never has to know
 *  about this module. */
export type GlossaryTermRenderer = ComponentType<{
  term: string;
  explanation: string;
  children: ReactNode;
}>;

/**
 * Inline markdown: `code`, **bold**, *italic*, [links](url).
 *
 * When a glossary is supplied, every term inside the text is also marked,
 * using the renderer the caller passes in. Without one, the text is only
 * formatted, which is what the explanations want.
 */
export function InlineText({
  text,
  glossary = [],
  TermComponent,
}: {
  text: string;
  glossary?: GlossaryEntry[];
  TermComponent?: GlossaryTermRenderer;
}) {
  // Split on backticks first, then parse bold/italic in non-code segments
  const backtickParts = text.split("`");
  return (
    <>
      {backtickParts.map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className={CODE_CLASS}>
            <Runs
              text={part}
              glossary={glossary}
              TermComponent={TermComponent}
            />
          </code>
        ) : (
          <Formatted
            key={index}
            text={part}
            glossary={glossary}
            TermComponent={TermComponent}
          />
        ),
      )}
    </>
  );
}

function Runs({
  text,
  glossary,
  TermComponent,
}: {
  text: string;
  glossary: GlossaryEntry[];
  TermComponent?: GlossaryTermRenderer;
}) {
  const segments = splitByGlossaryTerms(text, glossary);

  return (
    <>
      {segments.map((segment, index) => {
        if (!segment.entry) {
          return <Fragment key={index}>{segment.text}</Fragment>;
        }
        if (!TermComponent) {
          return <Fragment key={index}>{segment.text}</Fragment>;
        }
        return (
          <TermComponent
            key={index}
            term={segment.entry.term}
            explanation={segment.entry.explanation}
          >
            {segment.text}
          </TermComponent>
        );
      })}
    </>
  );
}

function Formatted({
  text,
  glossary,
  TermComponent,
}: {
  text: string;
  glossary: GlossaryEntry[];
  TermComponent?: GlossaryTermRenderer;
}) {
  // Parse links [text](url), **bold**, *italic*
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {tokens.map((token, i) => {
        if (
          token.startsWith("[") &&
          token.includes("](") &&
          token.endsWith(")")
        ) {
          const closeBracket = token.indexOf("](");
          const label = token.slice(1, closeBracket);
          const href = token.slice(closeBracket + 2, -1);
          const isExternal =
            href.startsWith("http://") || href.startsWith("https://");
          return (
            <a
              key={i}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="font-medium text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {label}
            </a>
          );
        }
        if (token.startsWith("**") && token.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-heading">
              <Runs
                text={token.slice(2, -2)}
                glossary={glossary}
                TermComponent={TermComponent}
              />
            </strong>
          );
        }
        if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
          return (
            <em key={i} className="italic">
              <Runs
                text={token.slice(1, -1)}
                glossary={glossary}
                TermComponent={TermComponent}
              />
            </em>
          );
        }
        return (
          <Runs
            key={i}
            text={token}
            glossary={glossary}
            TermComponent={TermComponent}
          />
        );
      })}
    </>
  );
}
