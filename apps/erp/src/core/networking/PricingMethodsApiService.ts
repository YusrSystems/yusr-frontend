import { BaseApiServiceOld } from "yusr-ui";
import type PricingMethod from "../data/pricingMethod";

export default class PricingMethodsApiService extends BaseApiServiceOld<PricingMethod>
{
  routeName: string = "PricingMethods";
}
