import { PaymentMethod, type PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import { BaseApiService } from "yusr-ui";


export default class PaymentMethodsApiService extends BaseApiService<PaymentMethod, PaymentMethodDto>
{
	routeName: string = "PaymentMethods";

	override createEntity(dto: PaymentMethodDto): PaymentMethod
	{
		return new PaymentMethod(dto);
	}
}
