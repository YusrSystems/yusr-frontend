import type { Currency } from "../entities";
import { CurrenciesApiService } from "../networking";

export class CurrenciesRepo
{
  private static _currencies: Currency[] = [];
  public static async getAllAsync()
  {
    if (this._currencies.length === 0)
    {
      await this._getCurrenciesAsync();
    }
    return this._currencies;
  }

  private static async _getCurrenciesAsync()
  {
    const service = new CurrenciesApiService();
    const result = await service.Filter(1, 100);

    this._currencies = result.data ?? [];
  }
}
