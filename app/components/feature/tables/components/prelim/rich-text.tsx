import { looksLikeHtml } from "./helpers";

export function renderRichString(s: string) {
  if (!s) return null;
  if (looksLikeHtml(s)) {
    return (
      <span
        className="rich-content"
        dangerouslySetInnerHTML={{ __html: s }}
      />
    );
  }
  const lines = s.split("\n");
  return lines.map((l, i) => (
    <span key={i}>
      {l}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}
