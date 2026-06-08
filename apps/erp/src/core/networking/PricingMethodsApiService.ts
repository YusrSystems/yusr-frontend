import { BaseApiService } from "yusr-ui";
import PricingMethod from "../data/pricingMethod";
import type PricingMethodOld from "../data/pricingMethodOld";

export default class PricingMethodsApiService extends BaseApiService<PricingMethod, PricingMethodOld>
{
  routeName: string = "PricingMethods";

  override createEntity(dto: PricingMethodOld): PricingMethod
  {
    return new PricingMethod(dto);
  }
}
