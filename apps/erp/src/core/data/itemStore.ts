import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";


export class ItemStoreDto extends Dto
{
	public itemId!: number;
	public storeId!: number;
	public storeName!: string;
	public quantity!: number;
	public averageCost!: number;
}

export class ItemStore extends ChangeableEntity<ItemStoreDto>
{
	public itemId: Signal<number>;
	public storeId: Signal<number | undefined>;
	public storeName: Signal<string | undefined>;
	public quantity: Signal<number>;
	public averageCost: Signal<number>;

	constructor(dto?: Partial<ItemStoreDto>)
	{
		super(dto, [{
			field: "storeId",
			selector: (d) => d.storeId,
			validators: [Validators.required(i18n.t("stocking:items.storeRequired"))]
		}], ChangeableEntityMode.Create);

		this.itemId = this.assign("itemId", dto?.itemId ?? 0);
		this.storeId = this.assign("storeId", dto?.storeId);
		this.storeName = this.assign("storeName", dto?.storeName ?? "");
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
		this.averageCost = this.assign("averageCost", dto?.averageCost ?? 0);
	}
}