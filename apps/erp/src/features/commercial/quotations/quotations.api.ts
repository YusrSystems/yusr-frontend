import { QuotationDto } from "@/core/data/commercial/quotation";
import { createCrudResource } from "#/api";


export const quotationsApi = createCrudResource<QuotationDto>("Quotations");