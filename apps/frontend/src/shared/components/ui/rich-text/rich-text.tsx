import { Fragment } from "react";
import { cn } from "@/shared/lib/cn";

export type RichTextPart = string | { bold: string };

type RichTextProps = {
  /** Marker-string form: plain text with `<b>...</b>` ranges that render as <strong>. */
  value?: string;
  /** Typed array form: items are plain strings or `{ bold: "..." }`. Wins over `value`. */
  parts?: ReadonlyArray<RichTextPart>;
  /** Extra classes applied to each rendered <strong>. Defaults match the design tokens. */
  boldClassName?: string;
};

const BOLD_RE = /<b>([\s\S]*?)<\/b>/g;

function parseMarkerString(value: string): RichTextPart[] {
  const out: RichTextPart[] = [];
  let lastIndex = 0;
  BOLD_RE.lastIndex = 0;
  let match: RegExpExecArray | null = BOLD_RE.exec(value);
  while (match !== null) {
    if (match.index > lastIndex) out.push(value.slice(lastIndex, match.index));
    out.push({ bold: match[1] ?? "" });
    lastIndex = BOLD_RE.lastIndex;
    match = BOLD_RE.exec(value);
  }
  if (lastIndex < value.length) out.push(value.slice(lastIndex));
  return out;
}

export function RichText({ value, parts, boldClassName }: RichTextProps) {
  const resolved = parts ?? (value !== undefined ? parseMarkerString(value) : []);
  const boldCls = cn("font-semibold text-accent", boldClassName);

  return (
    <>
      {resolved.map((p, i) =>
        typeof p === "string" ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: parts are computed from a single string and never reorder
          <Fragment key={i}>{p}</Fragment>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: parts are computed from a single string and never reorder
          <strong key={i} className={boldCls}>
            {p.bold}
          </strong>
        ),
      )}
    </>
  );
}
