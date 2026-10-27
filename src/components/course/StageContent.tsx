import { ImageIcon } from "lucide-react";

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
      return (
        <div className="mt-4 space-y-3">
          {imageUrl ? (
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- uploaded stage images have unknown dimensions */}
              <img
                src={imageUrl}
                alt={content || "Stage illustration"}
                className="max-w-full h-auto rounded-lg border border-border shadow-sm"
              />
            </div>
          ) : (
            <div className="h-64 w-full rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center text-center p-6">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Image coming soon
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                {content ||
                  "This stage includes a diagram or illustration to support the explanation."}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Images are stored in{" "}
                <code className="px-1 py-0.5 bg-muted rounded">
                  public/uploads/
                </code>
              </p>
            </div>
          )}
          {content && imageUrl && (
            <p className="text-sm text-muted-foreground text-center italic">
              {content}
            </p>
          )}
        </div>
      );
    case "CHART":
      return <ChartDiagram content={content} />;
    default:
      return <RichText content={content} />;
  }
}

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

function InlineText({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded bg-muted px-1 py-0.5 font-mono text-[0.92em]"
          >
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function RichText({ content }: { content: string }) {
  const blocks = parseContentBlocks(content);
  return (
    <div className="mt-4 text-lg leading-relaxed text-foreground space-y-4">
      {blocks.map((block, idx) => {
        if (block.kind === "code") {
          return (
            <pre
              key={idx}
              className="overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed"
            >
              <code className="font-mono text-foreground whitespace-pre">
                {block.code}
              </code>
            </pre>
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
        return (
          <div key={idx} className="space-y-2">
            {paragraphs.map((p, j) => (
              <p key={j} className="whitespace-pre-line">
                <InlineText text={p.join("\n")} />
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ChartDiagram({ content }: { content: string }) {
  const steps = content
    .split("→")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.includes(":") ? s.split(":").slice(1).join(":").trim() : s));
  const cleaned = steps.filter(Boolean);
  if (cleaned.length < 2) {
    return (
      <div className="mt-4 bg-muted rounded-lg p-6 flex items-center justify-center text-muted-foreground text-sm">
        Chart visualization renders here
      </div>
    );
  }
  return (
    <div className="mt-4 bg-muted rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {cleaned.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && (
              <span className="text-muted-foreground font-medium">→</span>
            )}
            <span className="px-3 py-2 rounded-md bg-background border border-border text-sm font-medium text-foreground">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
