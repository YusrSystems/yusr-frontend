import { BalanceTransferDto } from "@/core/data/balanceTransfer";
import { createCrudResource } from "#/api";


export const balanceTransfersApi = createCrudResource<BalanceTransferDto>("BalanceTransfers");