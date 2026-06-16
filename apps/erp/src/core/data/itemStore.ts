import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, Dto, i18n, Validators } from "yusr-ui";


export class ItemStoreDto extends Dto
{
	public itemId!: number;
	public storeId?: number;
	public storeName?: string;
	public initialQuantity!: number;
	public quantity!: number;
}

export class ItemStore extends ChangeableEntity<ItemStoreDto>
{
	public itemId: Signal<number>;
	public storeId: Signal<number>;
	public storeName: Signal<string | undefined>;
	public initialQuantity: Signal<number>;
	public quantity: Signal<number>;

	constructor(dto?: Partial<ItemStoreDto>)
	{
		super(dto, [{
			field: "storeId",
			selector: (d) => d.storeId,
			validators: [Validators.required(i18n.t("stocking:items.storeRequired"))]
		}, {
			field: "initialQuantity",
			selector: (d) => d.initialQuantity,
			validators: [Validators.min(0, i18n.t("stocking:items.initialQuantityMin"))]
		}], "create");

		this.itemId = this.assign("itemId", dto?.itemId ?? 0);
		this.storeId = this.assign("storeId", dto?.storeId ?? 0);
		this.storeName = this.assign("storeName", dto?.storeName ?? "");
		this.initialQuantity = this.assign("initialQuantity", dto?.initialQuantity ?? 0);
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
	}
}
