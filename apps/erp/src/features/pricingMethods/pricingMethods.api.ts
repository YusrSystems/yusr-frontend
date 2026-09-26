import { createSimpleListResource } from "yusr-ui";
import { type PricingMethodDto } from "@/core/data/pricingMethod";


export const pricingMethodsApi = createSimpleListResource<PricingMethodDto>("PricingMethods");