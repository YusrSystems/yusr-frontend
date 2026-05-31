import { BaseApiServiceOld } from "yusr-ui";
import type Stocktaking from "../data/stocktaking";

export default class StocktakingsApiService extends BaseApiServiceOld<Stocktaking>
{
  routeName: string = "Stocktakings";
}
