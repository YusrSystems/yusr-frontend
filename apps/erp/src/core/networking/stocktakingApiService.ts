import { BaseApiService } from "yusr-ui";
import type { StocktakingDto } from "../data/stocktaking";
import Stocktaking from "../data/stocktaking";

export default class StocktakingsApiService extends BaseApiService<Stocktaking, StocktakingDto>
{
  routeName: string = "Stocktakings";
  override createEntity(dto: StocktakingDto): Stocktaking
  {
    return new Stocktaking(dto);
  }
}
