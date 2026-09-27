import { createCrudResource } from "yusr-ui";
import { type CostAdjustmentDto } from "@/core/data/costAdjustment";


export const costAdjustmentsApi = createCrudResource<CostAdjustmentDto>("CostAdjustments");