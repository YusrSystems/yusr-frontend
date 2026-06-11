import { BaseApiServiceOld } from "yusr-ui";
import type PaymentMethodOld from "../data/paymentMethod";

export default class PaymentMethodsApiServiceOld extends BaseApiServiceOld<PaymentMethodOld>
{
  routeName: string = "PaymentMethods";
}
