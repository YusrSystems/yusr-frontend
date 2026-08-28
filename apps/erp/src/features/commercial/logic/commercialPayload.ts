import type { StorageFile } from "yusr-ui";
import { CommercialMath } from "./commercialMath";
import type {
	CommercialDocument,
	ICommercialDocument,
	ICommercialDocumentDto
} from "@/core/data/commercial/commercialDocument";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem";


export async function prepareCommercialPayload<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>(
	entity: CommercialDocument<TDto, TItem, TItemDto>,
	commitFiles: (files: StorageFile[] | undefined, folder: string) => Promise<StorageFile[]>,
	storageFolder: string
): Promise<TDto>
{
	const data = entity.toJson();
	data.fullAmount = CommercialMath.calcDocumentTaxInclusivePrice(
		entity.items.value.map((i) => ({
			taxExclusivePrice: i.taxExclusivePrice.value,
			taxInclusivePrice: i.taxInclusivePrice.value,
			settlement: i.settlement.value,
			quantity: i.quantity.value,
			totalTaxesPerc: i.totalTaxesPerc.value
		}))
	);
	data.items.forEach((item, index) =>
	{
		item.index = index;
	});
	data.files = await commitFiles(entity.files.value, storageFolder);
	return data;
}