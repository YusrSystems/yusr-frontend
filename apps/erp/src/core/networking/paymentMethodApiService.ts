import { BaseApiService } from "yusr-core";
import type PaymentMethod from "../data/paymentMethod";

export default class PaymentMethodsApiService extends BaseApiService<PaymentMethod>
{
  routeName: string = "PaymentMethods";
}
