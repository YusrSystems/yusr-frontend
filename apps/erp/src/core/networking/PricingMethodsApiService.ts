import { BaseApiService } from "yusr-ui";
import type PricingMethod from "../data/pricingMethod";

export default class PricingMethodsApiService extends BaseApiService<PricingMethod>
{
  routeName: string = "PricingMethods";
}
