import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { yusrNamespaces, yusrResources } from "yusr-ui";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],
    ns: [...yusrNamespaces, "landing"],
    defaultNS: "common",

    partialBundledLanguages: true,
    resources: yusrResources,

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    },

    detection: {
      order: ["localStorage", "htmlTag", "cookie", "navigator"],
      caches: ["localStorage", "cookie"]
    },

    interpolation: {
      escapeValue: false
    }
  });

i18n.on("languageChanged", (lng) =>
{
  document.documentElement.setAttribute("lang", lng);
  document.documentElement.setAttribute("dir", i18n.dir(lng));
});

export default i18n;
