import { CostAdjustmentDto } from "@/core/data/costAdjustment";
import { createCrudResource } from "#/api";


export const costAdjustmentsApi = createCrudResource<CostAdjustmentDto>("CostAdjustments");