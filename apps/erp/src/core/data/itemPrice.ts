import { type Signal, signal } from "@preact/signals-react";
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
	public pricingMethodId: Signal<number | undefined>;
	public pricingMethodName: Signal<string>;
	public price: Signal<number>;
	public unitPrice: Signal<number>;

	constructor(dto?: Partial<ItemPriceDto>, multiplier?: Signal<number>)
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
				validators: [
					Validators.required(i18n.t("stocking:items.priceRequired", "سعر البيع مطلوب")),
					Validators.min(0, i18n.t("stocking:items.priceMin", "يجب ألا يقل السعر عن الصفر"))
				]
			}
		], ChangeableEntityMode.Create);

		this.itemUoMId = this.assign("itemUoMId", dto?.itemUoMId);
		this.pricingMethodId = this.assign("pricingMethodId", dto?.pricingMethodId);
		this.pricingMethodName = this.assign("pricingMethodName", dto?.pricingMethodName);
		this.price = this.assign("price", dto?.price ?? 0);

		const initialMultiplier = multiplier?.value ?? 1;
		this.unitPrice = signal(Number((this.price.value / initialMultiplier).toFixed(2)));

		// 1. If the parent packaging unit multiplier changes, update total package price
		if (multiplier)
		{
			multiplier.subscribe((newMultiplier) =>
			{
				const safeMultiplier = newMultiplier || 1;
				const expectedPrice = Number((this.unitPrice.peek() * safeMultiplier).toFixed(2));

				if (this.price.peek() !== expectedPrice)
				{
					this.price.value = expectedPrice;
				}
			});
		}

		// 2. If the user edits the unit price directly, update total package price
		this.unitPrice.subscribe((newUnitPrice) =>
		{
			const safeMultiplier = multiplier ? (multiplier.peek() || 1) : 1;
			const expectedPrice = Number((newUnitPrice * safeMultiplier).toFixed(2));

			if (this.price.peek() !== expectedPrice)
			{
				this.price.value = expectedPrice;
			}
		});

		// 3. If total package price changes, update unit price
		this.price.subscribe((newPrice) =>
		{
			const safeMultiplier = multiplier ? (multiplier.peek() || 1) : 1;
			const expectedUnit = Number((newPrice / safeMultiplier).toFixed(2));

			if (this.unitPrice.peek() !== expectedUnit)
			{
				this.unitPrice.value = expectedUnit;
			}
		});
	}
}