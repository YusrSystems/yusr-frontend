import { BaseApiServiceOld } from "yusr-ui";
import type { TaxOld } from "../data/tax";

export default class TaxesApiServiceOld extends BaseApiServiceOld<TaxOld>
{
  routeName: string = "Taxes";
}
