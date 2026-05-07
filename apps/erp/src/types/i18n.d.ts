import "i18next";
import { arCommon, arCommonEntities } from "yusr-ui";
import accounting from "../../public/locales/ar/accounting.json";
import erpCommon from "../../public/locales/ar/erpCommon.json";
import landing from "../../public/locales/ar/landing.json";
import loginRegister from "../../public/locales/ar/loginRegister.json";
import stocking from "../../public/locales/ar/stocking.json";

declare module "i18next"
{
  interface CustomTypeOptions
  {
    defaultNS: "common";
    resources: {
      erpCommon: typeof erpCommon;
      common: typeof arCommon;
      landing: typeof landing;
      loginRegister: typeof loginRegister;
      accounting: typeof accounting;
      stocking: typeof stocking;
      commonEntities: typeof arCommonEntities;
    };
  }
}
