import { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { ItemPrice, ItemPriceDto } from "./itemPrice";


export class ItemUoMDto extends Dto
{
	public itemId!: number;
	public unitId!: number;
	public unitName!: string;
	public quantityMultiplier!: number;
	public barcode?: string;
	public prices: ItemPriceDto[] = [];
}

export class ItemUoM extends ChangeableEntity<ItemUoMDto>
{
	public itemId: Signal<number>;
	public unitId: Signal<number>;
	public unitName: Signal<string>;
	public quantityMultiplier: Signal<number>;
	public barcode: Signal<string | undefined>;
	public prices: Signal<ItemPrice[]>;

	constructor(dto?: Partial<ItemUoMDto>)
	{
		super(dto, [
			{
				field: "unitId",
				selector: (d) => d.unitId,
				validators: [Validators.required(i18n.t("stocking:items.unitRequired", "الوحدة مطلوبة"))]
			},
			{
				field: "quantityMultiplier",
				selector: (d) => d.quantityMultiplier,
				validators: [Validators.min(0.0001, i18n.t("stocking:items.quantityMultiplierMin", "يجب أن يكون معامل التحويل أكبر من الصفر"))]
			},
			{
				field: "prices",
				selector: (d) => d.prices,
				validators: [
					Validators.arrayMinLength(1, i18n.t("stocking:items.pricingMethodsRequired", "يجب إضافة طريقة تسعير واحدة على الأقل")),
					// Rule B: Prevent duplicate pricing tiers inside a single unit row
					Validators.custom((val: ItemPriceDto[]) =>
					{
						const ids = val.map(p => p.pricingMethodId).filter(id => id != undefined && id > 0);
						return new Set(ids).size === ids.length;
					}, i18n.t("stocking:items.duplicatePricingMethodError", "لا يمكن تكرار نفس طريقة التسعير لنفس وحدة التغليف"))
				]
			}
		], ChangeableEntityMode.Create);

		this.itemId = this.assign("itemId", dto?.itemId ?? 0);
		this.unitId = this.assign("unitId", dto?.unitId ?? 0);
		this.unitName = this.assign("unitName", dto?.unitName ?? "");
		this.quantityMultiplier = this.assign("quantityMultiplier", dto?.quantityMultiplier ?? 1);
		this.barcode = this.assign("barcode", dto?.barcode ?? null);
		this.prices = this.assign("prices", (dto?.prices ?? [
			{
				itemUoMId: 0,
				pricingMethodId: undefined,
				pricingMethodName: undefined,
				price: 0
			} as ItemPriceDto
		]).map(p => new ItemPrice(p)));

		const checkChildren = () =>
		{
			this.hasChanges.value = this.prices.value.some(p => p.hasChanges.value);
		};
		this.prices.value.forEach(p => p.hasChanges.subscribe(checkChildren));
	}

	static generateBarcode(length = 12)
	{
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		return Array.from(
			{length},
			() => chars[Math.floor(Math.random() * chars.length)]
		).join("");
	}

	override validate(dto?: Partial<ItemUoMDto>): boolean
	{
		const selfValid = super.validate(dto);
		const childrenValid = this.prices.value.every(p => p.validate());
		return selfValid && childrenValid;
	}

	generateBarcode(length = 12): void
	{
		this.barcode.value = ItemUoM.generateBarcode(length);
	}
}