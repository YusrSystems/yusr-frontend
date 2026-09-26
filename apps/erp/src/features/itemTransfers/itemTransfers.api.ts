import { ItemTransferDto } from "@/core/data/itemTransfer";
import { createCrudResource } from "#/api";


export const itemTransfersApi = createCrudResource<ItemTransferDto>("ItemTransfers");