import { BaseApiService } from "yusr-core";
import type { Tax } from "../data/tax";

export default class TaxesApiService extends BaseApiService<Tax>
{
  routeName: string = "Taxes";
}
