import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";


export class ItemPriceDto extends Dto
{
	public itemUoMId!: number;
	public pricingMethodId?: number;
	public pricingMethodName?: string;
	public price!: number;
}

export class ItemPrice extends ChangeableEntity<ItemPriceDto>
{
	public itemUoMId: Signal<number>;
	public pricingMethodId: Signal<number>;
	public pricingMethodName: Signal<string>;
	public price: Signal<number>;
	public unitPrice: Signal<number>;

	constructor(dto?: Partial<ItemPriceDto>)
	{
		super(dto, [
			{
				field: "pricingMethodId",
				selector: (d) => d.pricingMethodId,
				validators: [Validators.required(i18n.t("stocking:items.pricingMethodRequired", "طريقة التسعير مطلوبة"))]
			},
			{
				field: "price",
				selector: (d) => d.price,
				validators: [Validators.min(0, i18n.t("stocking:items.priceMin", "يجب ألا يقل السعر عن الصفر"))]
			}
		], ChangeableEntityMode.Create);

		this.itemUoMId = this.assign("itemUoMId", dto?.itemUoMId ?? 0);
		this.pricingMethodId = this.assign("pricingMethodId", dto?.pricingMethodId ?? 0);
		this.pricingMethodName = this.assign("pricingMethodName", dto?.pricingMethodName ?? "");
		this.price = this.assign("price", dto?.price ?? 0);
		this.unitPrice = this.assign("price", dto?.price ?? 0);
	}
}