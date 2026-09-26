import { CurrencyDto } from "#/entities";
import { createReadOnlyListResource } from "#/api/createReadOnlyListResource.ts";


export const currenciesApi = createReadOnlyListResource<CurrencyDto>("Currencies");