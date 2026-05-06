import "i18next";
import { arCommonEntities } from "yusr-ui";
import accounting from "../../public/locales/ar/accounting.json";
import common from "../../public/locales/ar/common.json";
import landing from "../../public/locales/ar/landing.json";
import loginRegister from "../../public/locales/ar/loginRegister.json";

declare module "i18next"
{
  interface CustomTypeOptions
  {
    defaultNS: "common";
    resources: {
      common: typeof common;
      landing: typeof landing;
      loginRegister: typeof loginRegister;
      accounting: typeof accounting;
      commonEntities: typeof arCommonEntities;
    };
  }
}
