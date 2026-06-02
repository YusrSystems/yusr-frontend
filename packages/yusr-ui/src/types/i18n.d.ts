import "i18next";
import arCommon from "../locale/ar/common.json";
import arCommonEntities from "../locale/ar/commonEntities.json";
import arLogin from "../locale/ar/login.json";
declare module "i18next"
{
  interface CustomTypeOptions
  {
    defaultNS: "common";
    resources: {
      common: typeof arCommon;
      commonEntities: typeof arCommonEntities;
      login: typeof arLogin;
    };
  }
}
