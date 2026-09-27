import { createSimpleListResource } from "yusr-ui";
import { type PaymentMethodDto } from "@/core/data/paymentMethod";

export const paymentMethodsApi = createSimpleListResource<PaymentMethodDto>("PaymentMethods");