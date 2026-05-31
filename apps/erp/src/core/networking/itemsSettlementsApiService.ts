import { BaseApiServiceOld } from "yusr-ui";
import type ItemsSettlement from "../data/itemsSettlement";

export default class ItemsSettlementsApiService extends BaseApiServiceOld<ItemsSettlement>
{
  routeName: string = "ItemSettlements";
}
