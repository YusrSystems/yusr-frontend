import { BaseApiServiceOld } from "yusr-ui";
import type BalanceTransfer from "../data/balanceTransfer";

export default class BalanceTransfersApiService extends BaseApiServiceOld<BalanceTransfer>
{
  routeName: string = "BalanceTransfers";
}
