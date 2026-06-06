import { Currency, type CurrencyDto } from "../entities/currency";
import { BaseFilterableApiService } from "./baseFilterableApiService";

export class CurrenciesApiService extends BaseFilterableApiService<Currency, CurrencyDto>
{
  routeName: string = "Currencies";

  createEntity(dto: CurrencyDto): Currency
  {
    return new Currency(dto);
  }
}
