import { createCrudResource } from "yusr-ui";
import { type ItemTransferDto } from "@/core/data/itemTransfer";


export const itemTransfersApi = createCrudResource<ItemTransferDto>("ItemTransfers");