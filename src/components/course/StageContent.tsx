"use client";

import { useState } from "react";
import { ImageIcon, Copy, Check } from "lucide-react";

export function StageContent({
  type,
  content,
  imageUrl,
}: {
  type: string;
  content: string;
  imageUrl: string | null;
}) {
  switch (type) {
    case "IMAGE":
      return <PremiumImage content={content} imageUrl={imageUrl} />;
    case "CHART":
      return <ChartDiagram content={content} />;
    default:
      return <RichText content={content} />;
  }
}

/* ─── Image ─────────────────────────────────────────────────────── */

function PremiumImage({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl: string | null;
}) {
  return (
    <div
      className="mt-6 space-y-4"
      style={{ animation: "fadeInScale 0.5s ease-out both" }}
    >
      {imageUrl ? (
        <div className="relative group flex items-center justify-center">
          {/* ambient glow */}
          <div className="absolute -inset-4 rounded-3xl bg-[var(--color-glow)] blur-2xl opacity-60 transition-opacity group-hover:opacity-100 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded stage images have unknown dimensions */}
          <img
            src={imageUrl}
            alt={content || "Stage illustration"}
            className="relative max-w-full h-auto rounded-xl border border-border shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.01]"
          />
        </div>
      ) : (
        /* Skeleton placeholder */
        <div className="relative h-64 w-full rounded-xl border border-border bg-card overflow-hidden flex flex-col items-center justify-center text-center p-6">
          {/* shimmer overlay */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 25%, var(--color-glow) 50%, transparent 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Image coming soon
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {content ||
                "This stage includes a diagram or illustration to support the explanation."}
            </p>
          </div>
        </div>
      )}
      {content && imageUrl && (
        <p className="text-sm text-muted-foreground text-center italic border-l-2 border-primary pl-3 mx-auto max-w-lg">
          {content}
        </p>
      )}
    </div>
  );
}

/* ─── Rich text ─────────────────────────────────────────────────── */

function parseContentBlocks(content: string) {
  const parts = content.split(/```(\w*)\n?([\s\S]*?)```/g);
  const blocks: Array<{
    kind: "text" | "code";
    text?: string;
    lang?: string;
    code?: string;
  }> = [];
  for (let i = 0; i < parts.length; i += 3) {
    const text = parts[i];
    const lang = parts[i + 1];
    const code = parts[i + 2];
    if (text && text.trim()) blocks.push({ kind: "text", text: text.trim() });
    if (code && code.trim())
      blocks.push({ kind: "code", lang: lang || "text", code });
  }
  return blocks;
}

/**
 * Parse inline markdown: `code`, **bold**, *italic*
 */
function InlineText({ text }: { text: string }) {
  // Split on backticks first, then parse bold/italic in non-code segments
  const backtickParts = text.split("`");
  return (
    <>
      {backtickParts.map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded-md bg-primary/[0.08] text-primary border border-primary/15 px-1.5 py-0.5 font-mono text-[0.88em]"
          >
            {part}
          </code>
        ) : (
          <InlineFormattedText key={index} text={part} />
        ),
      )}
    </>
  );
}

function InlineFormattedText({ text }: { text: string }) {
  // Parse **bold** and *italic*
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith("**") && token.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-heading">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
          return (
            <em key={i} className="italic">
              {token.slice(1, -1)}
            </em>
          );
        }
        return token;
      })}
    </>
  );
}

function RichText({ content }: { content: string }) {
  const blocks = parseContentBlocks(content);
  let isFirstTextBlock = true;

  return (
    <div className="mt-6 text-[1.0625rem] leading-[1.8] text-foreground space-y-5">
      {blocks.map((block, idx) => {
        if (block.kind === "code") {
          return (
            <div
              key={idx}
              style={{
                animation: `fadeInScale 0.4s ease-out ${100 + idx * 60}ms both`,
              }}
            >
              <CodeBlock lang={block.lang || "text"} code={block.code || ""} />
            </div>
          );
        }

        const lines = (block.text || "").split("\n");
        const paragraphs: string[][] = [];
        let current: string[] = [];
        for (const line of lines) {
          if (!line.trim()) {
            if (current.length) {
              paragraphs.push(current);
              current = [];
            }
          } else {
            current.push(line);
          }
        }
        if (current.length) paragraphs.push(current);

        const showDropCap = isFirstTextBlock;
        if (isFirstTextBlock) isFirstTextBlock = false;

        return (
          <div
            key={idx}
            className="space-y-3"
            style={{
              animation: `slideUp 0.4s ease-out ${80 + idx * 60}ms both`,
            }}
          >
            {paragraphs.map((p, j) => {
              const text = p.join("\n");
              const canDropCap =
                showDropCap && j === 0 && text.length > 20 && /^[a-zA-Z]/.test(text);

              if (canDropCap) {
                return (
                  <p key={j} className="whitespace-pre-line">
                    <span className="float-left text-4xl font-bold text-primary leading-[0.85] mr-2 mt-1 select-none">
                      {text[0]}
                    </span>
                    <InlineText text={text.slice(1)} />
                  </p>
                );
              }
              return (
                <p key={j} className="whitespace-pre-line">
                  <InlineText text={text} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Code block ────────────────────────────────────────────────── */

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-[var(--color-code-bg)]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-[var(--color-code-bg)]">
        <div className="flex items-center gap-3">
          {/* macOS dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {lang}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

/* ─── Chart / flow diagram ──────────────────────────────────────── */

function ChartDiagram({ content }: { content: string }) {
  const steps = content
    .split("→")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.includes(":") ? s.split(":").slice(1).join(":").trim() : s));
  const cleaned = steps.filter(Boolean);

  if (cleaned.length < 2) {
    return (
      <div className="mt-6 rounded-xl border border-border bg-card p-8 flex items-center justify-center text-muted-foreground text-sm">
        Chart visualization renders here
      </div>
    );
  }

  return (
    <div
      className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8 overflow-x-auto"
      style={{ animation: "fadeInScale 0.5s ease-out both" }}
    >
      <div className="flex items-center justify-center gap-0 min-w-max">
        {cleaned.map((step, idx) => (
          <div
            key={idx}
            className="flex items-center gap-0"
            style={{
              animation: `slideUp 0.4s ease-out ${idx * 100}ms both`,
            }}
          >
            {idx > 0 && (
              /* connector */
              <div className="flex items-center mx-1">
                <div className="w-6 md:w-10 h-0.5 bg-gradient-to-r from-primary/60 to-primary/30 rounded-full" />
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-primary/50" />
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              {/* numbered badge */}
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                {idx + 1}
              </span>
              {/* step card */}
              <div className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                {step}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
