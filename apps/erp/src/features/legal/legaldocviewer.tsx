import { useState } from "react";
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
  .legal-body h1 { font-size: 1.6rem; font-weight: 700; margin: 0 0 1rem; color: hsl(var(--foreground)); }
  .legal-body h2 { font-size: 1.2rem; font-weight: 600; margin: 2rem 0 0.5rem; padding-bottom: 6px; border-bottom: 1px solid hsl(var(--border)); color: hsl(var(--foreground)); }
  .legal-body h3 { font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.4rem; color: hsl(var(--foreground)); }
  .legal-body p  { margin: 0.6rem 0; line-height: 1.8; color: hsl(var(--muted-foreground)); }
  .legal-body ul { padding-left: 1.4rem; margin: 0.5rem 0; }
  .legal-body ol { padding-left: 1.4rem; margin: 0.5rem 0; }
  .legal-body li { margin: 0.4rem 0; line-height: 1.8; color: hsl(var(--muted-foreground)); }
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
    <div className="min-h-screen bg-background text-foreground">
      <style>{ css }</style>

      { /* Sticky header */ }
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-6">
          { /* Language switcher */ }
          <div className="flex items-center gap-1 pt-4 pb-2">
            { (["ar", "en"] as Lang[]).map((l) => (
              <button
                key={ l }
                onClick={ () => switchLang(l) }
                className={ `px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  lang === l
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }` }
              >
                { l === "ar" ? "العربية" : "English" }
              </button>
            )) }
          </div>

          { /* Doc tabs */ }
          <div
            className={ `flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide ` }
          >
            { docs.map((f, i) => (
              <button
                key={ i }
                onClick={ () => setActive(i) }
                className={ `whitespace-nowrap px-4 py-1.5 text-sm transition-colors rounded-md ${
                  i === active
                    ? "text-foreground font-medium bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }` }
              >
                { f.name }
              </button>
            )) }
          </div>
        </div>
      </div>

      { /* Content */ }
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div
          className="legal-body"
          dir={ rtl ? "rtl" : "ltr" }
          dangerouslySetInnerHTML={ { __html: parseMarkdown(doc.content) } }
        />

        <div className="mt-16 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          Yusr Systems · yusrsystems@gmail.com
        </div>
      </div>
    </div>
  );
}
