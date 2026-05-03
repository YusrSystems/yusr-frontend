import { BaseApiService } from "yusr-ui";
import type Stocktaking from "../data/stocktaking";

export default class StocktakingsApiService extends BaseApiService<Stocktaking>
{
  routeName: string = "Stocktakings";
}
