import { useState } from "react";
import { Button } from "yusr-ui";
import privacyAr from "./privacy-policy-ar.md?raw";
import privacyEn from "./privacy-policy-en.md?raw";
import refundAr from "./refund-policy-ar.md?raw";
import refundEn from "./refund-policy-en.md?raw";
import tosAr from "./terms-of-service-ar.md?raw";
import tosEn from "./terms-of-service-en.md?raw";

const files = {
  ar: [{ name: "سياسة الخصوصية", content: privacyAr }, { name: "سياسة الاسترداد", content: refundAr }, {
    name: "شروط الخدمة",
    content: tosAr
  }],
  en: [{ name: "Privacy Policy", content: privacyEn }, { name: "Refund Policy", content: refundEn }, {
    name: "Terms of Service",
    content: tosEn
  }]
};

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

type Lang = "ar" | "en";

export default function LegalDocViewer()
{
  const [lang, setLang] = useState<Lang>("ar");
  const [active, setActive] = useState(0);

  const docs = files[lang];
  const doc = docs[active];
  const rtl = lang === "ar";

  function switchLang(l: Lang)
  {
    setLang(l);
    setActive(0);
  }

  return (
    <div style={ { maxWidth: 720, margin: "0 auto", padding: "2rem 1rem", fontFamily: "Georgia, serif" } }>
      <style>{ css }</style>

      { /* Language switcher */ }
      <div style={ { display: "flex", gap: 8, marginBottom: 16 } }>
        { (["ar", "en"] as Lang[]).map((l) => (
          <Button
            key={ l }
            onClick={ () => switchLang(l) }
            style={ {
              padding: "4px 16px",
              border: "1px solid hsl(var(--border))",
              background: lang === l ? "hsl(var(--foreground))" : "hsl(var(--background))",
              color: lang === l ? "hsl(var(--background))" : "hsl(var(--muted-foreground))",
              cursor: "pointer",
              fontSize: 18,
              borderRadius: 4
            } }
          >
            { l === "ar" ? "العربية" : "English" }
          </Button>
        )) }
      </div>

      { /* Divider */ }
      <hr style={ { borderColor: "hsl(var(--border))", marginBottom: 16 } } />

      { /* Document tabs */ }
      <div style={ { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32, direction: rtl ? "rtl" : "ltr" } }>
        { docs.map((f, i) => (
          <Button
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
          </Button>
        )) }
      </div>

      { /* Document body */ }
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
