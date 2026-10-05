import { cloneElement, type ReactElement, type ReactNode } from "react";

/**
 * Puts elements into a translated sentence: rich("Write to <0>us</0>.", [<a href="…" />]) wraps "us"
 * in the link. Translators move the tags with the words, so links land on the right words in every
 * language.
 */
export function rich(s: string, parts: ReactElement<{ children?: ReactNode }>[]): ReactNode {
  const out: ReactNode[] = [];
  const re = /<(\d+)>(.*?)<\/\1>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(cloneElement(parts[Number(m[1])], { key: out.length }, m[2]));
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
