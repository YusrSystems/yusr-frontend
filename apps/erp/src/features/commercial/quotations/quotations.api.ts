import { createCrudResource, type ICrudResource } from "yusr-ui";
import { type QuotationDto } from "@/core/data/commercial/quotation";


export const quotationsApi: ICrudResource<QuotationDto> = createCrudResource<QuotationDto>("Quotations");