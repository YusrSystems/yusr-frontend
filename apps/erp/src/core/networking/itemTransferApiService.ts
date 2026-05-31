import { BaseApiServiceOld } from "yusr-ui";
import type ItemTransfer from "../data/itemTransfer";

export default class ItemTransferApiService extends BaseApiServiceOld<ItemTransfer>
{
  routeName: string = "ItemTransfers";
}
