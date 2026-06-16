import { BaseApiService } from "yusr-ui";
import PricingMethod, { PricingMethodDto } from "../data/pricingMethod";


export default class PricingMethodsApiService extends BaseApiService<PricingMethod, PricingMethodDto>
{
	routeName: string = "PricingMethods";

	override createEntity(dto: PricingMethodDto): PricingMethod
	{
		return new PricingMethod(dto);
	}
}
