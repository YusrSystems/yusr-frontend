import { BaseApiServiceOld } from "yusr-ui";
import type PricingMethodOld from "../data/pricingMethodOld";

export default class PricingMethodsApiServiceOld extends BaseApiServiceOld<PricingMethodOld>
{
  routeName: string = "PricingMethods";
}
