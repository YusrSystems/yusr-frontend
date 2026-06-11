import { BalanceTransfer, type BalanceTransferDto } from "@/features/balanceTransfer/data/balanceTransfer";
import { BaseApiService } from "yusr-ui";
export default class BalanceTransfersApiService extends BaseApiService<BalanceTransfer, BalanceTransferDto>
{
  routeName: string = "BalanceTransfers";

  override createEntity(dto: BalanceTransferDto): BalanceTransfer
  {
    return new BalanceTransfer(dto);
  }
}
