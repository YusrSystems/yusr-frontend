import { signal } from "@preact/signals-react";
import i18next from "i18next";

i18next.on("languageChanged", (lng) =>
{
  CurrentLanguage.value = lng;
});

export const CurrentLanguage = signal(i18next.language || "ar");
