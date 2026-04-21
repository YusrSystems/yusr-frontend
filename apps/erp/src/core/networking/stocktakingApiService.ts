import { BaseApiService } from "yusr-core";
import type Stocktaking from "../data/stocktaking";

export default class StocktakingsApiService extends BaseApiService<Stocktaking>
{
  routeName: string = "Stocktakings";
}
