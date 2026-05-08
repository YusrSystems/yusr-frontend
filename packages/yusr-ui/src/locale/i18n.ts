import arCommon from "./ar/common.json";
import arCommonEntities from "./ar/commonEntities.json";
import enCommon from "./en/common.json";
import enCommonEntities from "./en/commonEntities.json";
import urCommon from "./ur/common.json";
import urCommonEntities from "./ur/commonEntities.json";

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
  }
};

export const yusrNamespaces = ["common", "commonEntities"] as const;
