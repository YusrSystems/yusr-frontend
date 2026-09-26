import { createSimpleListResource } from "yusr-ui";
import { type TaxDto } from "@/core/data/tax";


export const taxesApi = createSimpleListResource<TaxDto>("Taxes");