import { useState } from "react";
import privacyAr from "./privacy-policy-ar.md?raw";
import privacyEn from "./privacy-policy-en.md?raw";
import refundAr from "./refund-policy-ar.md?raw";
import refundEn from "./refund-policy-en.md?raw";
import tosAr from "./terms-of-service-ar.md?raw";
import tosEn from "./terms-of-service-en.md?raw";

const files = [
  { name: "Privacy Policy (AR)", content: privacyAr },
  { name: "Privacy Policy (EN)", content: privacyEn },
  { name: "Refund Policy (AR)", content: refundAr },
  { name: "Refund Policy (EN)", content: refundEn },
  { name: "Terms of Service (AR)", content: tosAr },
  { name: "Terms of Service (EN)", content: tosEn }
];

const css = `
  .legal-body h1 { font-size: 1.8rem; font-weight: 700; margin: 0 0 1rem; color: hsl(var(--foreground)); }
  .legal-body h2 { font-size: 1.3rem; font-weight: 600; margin: 2rem 0 0.5rem; padding-bottom: 4px; border-bottom: 1px solid hsl(var(--border)); color: hsl(var(--foreground)); }
  .legal-body h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.4rem; color: hsl(var(--foreground)); }
  .legal-body p  { margin: 0.6rem 0; color: hsl(var(--muted-foreground)); }
  .legal-body ul { padding-left: 1.4rem; margin: 0.5rem 0; }
  .legal-body ol { padding-left: 1.4rem; margin: 0.5rem 0; }
  .legal-body li { margin: 0.3rem 0; color: hsl(var(--muted-foreground)); }
  .legal-body strong { font-weight: 600; color: hsl(var(--foreground)); }
  .legal-body em { font-style: italic; }
  .legal-body code { background: hsl(var(--muted)); color: hsl(var(--foreground)); padding: 1px 5px; font-size: 0.9em; border-radius: 3px; }
  .legal-body hr { border: none; border-top: 1px solid hsl(var(--border)); margin: 1.5rem 0; }
`;

function inline(text: string)
{
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function parseMarkdown(md: string)
{
  if (!md)
  {
    return "";
  }
  return md
    .split(/\n\n+/)
    .map((block) =>
    {
      block = block.trim();
      if (!block)
      {
        return "";
      }
      if (/^### /.test(block))
      {
        return `<h3>${inline(block.slice(4))}</h3>`;
      }
      if (/^## /.test(block))
      {
        return `<h2>${inline(block.slice(3))}</h2>`;
      }
      if (/^# /.test(block))
      {
        return `<h1>${inline(block.slice(2))}</h1>`;
      }
      if (/^---$/.test(block))
      {
        return `<hr/>`;
      }
      const lines = block.split("\n");
      if (lines.every((l) => /^- /.test(l)))
      {
        return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
      }
      if (lines.every((l) => /^\d+\. /.test(l)))
      {
        return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
      }
      return `<p>${inline(block)}</p>`;
    })
    .join("\n");
}

function isRTL(text: string)
{
  return (text.match(/[\u0600-\u06ff]/g) || []).length
    > (text.match(/[a-zA-Z]/g) || []).length;
}

export default function LegalDocViewer()
{
  const [active, setActive] = useState(0);
  const doc = files[active];
  const rtl = isRTL(doc.content);

  return (
    <div
      style={ {
        maxWidth: 720,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "Georgia, serif",
        color: "hsl(var(--foreground))"
      } }
    >
      <style>{ css }</style>

      { /* Tabs */ }
      <div style={ { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 } }>
        { files.map((f, i) => (
          <button
            key={ i }
            onClick={ () => setActive(i) }
            style={ {
              padding: "4px 14px",
              border: "1px solid hsl(var(--border))",
              background: i === active ? "hsl(var(--foreground))" : "hsl(var(--background))",
              color: i === active ? "hsl(var(--background))" : "hsl(var(--muted-foreground))",
              cursor: "pointer",
              fontSize: 13,
              borderRadius: 4
            } }
          >
            { f.name }
          </button>
        )) }
      </div>

      { /* Document */ }
      <div
        className="legal-body"
        dir={ rtl ? "rtl" : "ltr" }
        dangerouslySetInnerHTML={ { __html: parseMarkdown(doc.content) } }
      />

      <hr style={ { marginTop: 48, borderColor: "hsl(var(--border))" } } />
      <p style={ { textAlign: "center", fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 12 } }>
        Yusr Systems · yusrsystems@gmail.com
      </p>
    </div>
  );
}
