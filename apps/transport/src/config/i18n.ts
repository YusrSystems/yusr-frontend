import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: "ar",
  supportedLngs: ["ar", "en"],
  ns: ["common"],
  defaultNS: "common",

  backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },

  detection: {
    order: ["localStorage", "htmlTag", "cookie", "navigator"],
    caches: ["localStorage", "cookie"] // Remember the user's choice
  },

  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (lng) =>
{
  document.documentElement.setAttribute("lang", lng);
  document.documentElement.setAttribute("dir", i18n.dir(lng));
});

export default i18n;
