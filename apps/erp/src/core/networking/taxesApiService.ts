import { BaseApiService } from "yusr-ui";
import { Tax, TaxDto } from "../data/tax";

export default class TaxesApiService extends BaseApiService<Tax, TaxDto>
{
  routeName: string = "Taxes";
  override createEntity(dto: TaxDto): Tax
  {
    return new Tax(dto);
  }
}
