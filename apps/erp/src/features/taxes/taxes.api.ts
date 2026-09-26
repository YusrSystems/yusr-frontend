import { TaxDto } from "@/core/data/tax";
import { createSimpleListResource } from "#/api";


export const taxesApi = createSimpleListResource<TaxDto>("Taxes");