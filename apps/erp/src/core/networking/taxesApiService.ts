import { BaseApiService } from "yusr-ui";
import type { Tax } from "../data/tax";

export default class TaxesApiService extends BaseApiService<Tax>
{
  routeName: string = "Taxes";
}
