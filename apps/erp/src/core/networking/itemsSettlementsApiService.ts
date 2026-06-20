import { BaseApiService } from "yusr-ui";
import type { StocktakingDto } from "../data/stocktaking";
import Stocktaking from "../data/stocktaking";

export default class ItemsSettlementsApiService extends BaseApiService<Stocktaking, StocktakingDto>
{
  routeName: string = "ItemSettlements";
  override createEntity(dto: StocktakingDto): Stocktaking
  {
    return new Stocktaking(dto);
  }
}
