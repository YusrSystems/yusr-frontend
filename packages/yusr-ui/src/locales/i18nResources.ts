import arCommon from "./ar/common.json";
import arCommonEntities from "./ar/commonEntities.json";
import arLogin from "./ar/login.json";
import bnCommon from "./bn/common.json";
import bnCommonEntities from "./bn/commonEntities.json";
import bnLogin from "./bn/login.json";
import enCommon from "./en/common.json";
import enCommonEntities from "./en/commonEntities.json";
import enLogin from "./en/login.json";
import hiCommon from "./hi/common.json";
import hiCommonEntities from "./hi/commonEntities.json";
import hiLogin from "./hi/login.json";
import urCommon from "./ur/common.json";
import urCommonEntities from "./ur/commonEntities.json";
import urLogin from "./ur/login.json";

export const yusrResources = {
  ar: {
    common: arCommon,
    commonEntities: arCommonEntities,
    login: arLogin
  },
  en: {
    common: enCommon,
    commonEntities: enCommonEntities,
    login: enLogin
  },
  ur: {
    common: urCommon,
    commonEntities: urCommonEntities,
    login: urLogin
  },
  bn: {
    common: bnCommon,
    commonEntities: bnCommonEntities,
    login: bnLogin
  },
  hi: {
    common: hiCommon,
    commonEntities: hiCommonEntities,
    login: hiLogin
  }
};

export const yusrNamespaces = ["common", "commonEntities", "login"] as const;
