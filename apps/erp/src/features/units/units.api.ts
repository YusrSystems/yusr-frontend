import { createSimpleListResource } from "#/api";
import type { UnitDto } from "@/core/data/unit.ts";


export const unitsApi = createSimpleListResource<UnitDto>("Units");