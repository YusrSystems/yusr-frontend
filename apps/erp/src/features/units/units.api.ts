import { createSimpleListResource } from "yusr-ui";
import { type UnitDto } from "@/core/data/unit";


export const unitsApi = createSimpleListResource<UnitDto>("Units");