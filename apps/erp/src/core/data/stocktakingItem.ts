import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";


export class StocktakingItemDto extends Dto
{
	public stocktakingId?: number;
	public itemId!: number;
	public itemName?: string;
	public itemUnitPricingMethodId?: number;
	public itemUnitPricingMethodName?: string;
	public quantityMultiplier!: number;
	public systemQuantity!: number;
	public variance!: number;
	public actualQuantity!: number;
}

export class StocktakingItem extends ChangeableEntity<StocktakingItemDto>
{
	public stocktakingId: Signal<number | undefined>;
	public itemId: Signal<number>;
	public itemName: Signal<string | undefined>;
	public itemUnitPricingMethodId: Signal<number | undefined>;
	public itemUnitPricingMethodName: Signal<string | undefined>;
	public quantityMultiplier: Signal<number>;
	public systemQuantity: Signal<number>;
	public variance: Signal<number>;
	public actualQuantity: Signal<number>;

	constructor(dto: Partial<StocktakingItemDto> | undefined)
	{
		super(dto, [{
			field: "itemId",
			selector: (d) => d.itemId,
			validators: [Validators.required(i18n.t("stocking:items.unitRequired"))]
		}, {
			field: "itemUnitPricingMethodId",
			selector: (d) => d.itemUnitPricingMethodId,
			validators: [Validators.required(i18n.t("stocking:items.pricingMethodRequired"))]
		}, {
			field: "quantityMultiplier",
			selector: (d) => d.quantityMultiplier,
			validators: [Validators.min(1, i18n.t("stocking:items.quantityMultiplierMin"))]
		}, {
			field: "actualQuantity",
			selector: (d) => d.actualQuantity,
			validators: [Validators.min(0, i18n.t("stocking:items.unitPriceMin"))]
		}], ChangeableEntityMode.Create);

		this.stocktakingId = this.assign("stocktakingId", dto?.stocktakingId ?? 0);
		this.itemId = this.assign("itemId", dto?.itemId ?? 0);
		this.itemName = this.assign("itemName", dto?.itemName ?? "");
		this.itemUnitPricingMethodId = this.assign("itemUnitPricingMethodId", dto?.itemUnitPricingMethodId ?? 0);
		this.itemUnitPricingMethodName = this.assign("itemUnitPricingMethodName", dto?.itemUnitPricingMethodName ?? "");
		this.quantityMultiplier = this.assign("quantityMultiplier", dto?.quantityMultiplier ?? 0);
		this.systemQuantity = this.assign("systemQuantity", dto?.systemQuantity ?? 0);
		this.variance = this.assign("variance", dto?.variance ?? 0);
		this.actualQuantity = this.assign("actualQuantity", dto?.actualQuantity ?? 0);
	}
}
