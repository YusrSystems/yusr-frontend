import { PaymentMethodDto } from "@/core/data/paymentMethod";
import { createSimpleListResource } from "#/api";


export const paymentMethodsApi = createSimpleListResource<PaymentMethodDto>("PaymentMethods");