import { BaseApiService } from "yusr-core";
import type ItemsSettlement from "../data/itemsSettlement";

export default class ItemsSettlementsApiService extends BaseApiService<ItemsSettlement>
{
  routeName: string = "ItemSettlements";
}
