import arCommon from "./ar/common.json";
import arCommonEntities from "./ar/commonEntities.json";
import enCommon from "./en/common.json";
import enCommonEntities from "./en/commonEntities.json";
import urCommon from "./ur/common.json";
import urCommonEntities from "./ur/commonEntities.json";
import bnCommon from "./bn/common.json";
import bnCommonEntities from "./bn/commonEntities.json";
import hiCommon from "./hi/common.json";
import hiCommonEntities from "./hi/commonEntities.json";

export const yusrResources = {
  ar: {
    common: arCommon,
    commonEntities: arCommonEntities
  },
  en: {
    common: enCommon,
    commonEntities: enCommonEntities
  },
  ur: {
    common: urCommon,
    commonEntities: urCommonEntities
  },
  bn: {
    common: bnCommon,
    commonEntities: bnCommonEntities
  },
  hi: {
    common: hiCommon,
    commonEntities: hiCommonEntities
  }
};

export const yusrNamespaces = ["common", "commonEntities"] as const;
