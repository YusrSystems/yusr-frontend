import { BaseApiService } from "yusr-ui";
import type { TaxOld } from "../data/tax";

export default class TaxesApiService extends BaseApiService<TaxOld>
{
  routeName: string = "Taxes";
}
