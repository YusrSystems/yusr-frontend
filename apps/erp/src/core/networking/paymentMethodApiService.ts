import { BaseApiServiceOld } from "yusr-ui";
import type PaymentMethod from "../data/paymentMethod";

export default class PaymentMethodsApiService extends BaseApiServiceOld<PaymentMethod>
{
  routeName: string = "PaymentMethods";
}
