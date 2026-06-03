import { BaseApiService, type EntityMode } from "yusr-ui";
import { Tax, TaxDto } from "../data/tax";

export default class TaxesApiService extends BaseApiService<Tax, TaxDto>
{
  routeName: string = "Taxes";
  override createEntity(dto: TaxDto, mode: EntityMode): Tax
  {
    return new Tax(dto, mode);
  }
}
