import { createSimpleListResource } from "#/api";
import type { PricingMethodDto } from "@/core/data/pricingMethod.ts";


export const pricingMethodsApi = createSimpleListResource<PricingMethodDto>("PricingMethods");