import "i18next";
import common from "../../public/locales/ar/common.json";
import landing from "../../public/locales/ar/landing.json";

declare module "i18next"
{
  interface CustomTypeOptions
  {
    defaultNS: "common";
    resources: {
      common: typeof common;
      landing: typeof landing;
    };
  }
}
