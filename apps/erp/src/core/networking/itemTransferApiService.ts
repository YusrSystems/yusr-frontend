import { BaseApiService } from "yusr-ui";
import type { ItemTransferDto } from "../data/itemTransfer";
import ItemTransfer from "../data/itemTransfer";


export default class ItemTransferApiService extends BaseApiService<ItemTransfer, ItemTransferDto>
{
	routeName: string = "ItemTransfers";

	override createEntity(dto: ItemTransferDto): ItemTransfer
	{
		return new ItemTransfer(dto);
	}
}
