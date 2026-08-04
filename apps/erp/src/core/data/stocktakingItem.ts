import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";


export class StocktakingItemDto extends Dto
{
	public stocktakingId?: number;
	public itemsSettlementId?: number;
	public itemId!: number;
	public itemName?: string;
	public itemUoMId?: number;
	public unitName?: string;
	public quantityMultiplier!: number;
	public systemQuantity!: number;
	public variance!: number;
	public actualQuantity!: number;
	public unitCost?: number;
}

export class StocktakingItem extends ChangeableEntity<StocktakingItemDto>
{
	public stocktakingId: Signal<number | undefined>;
	public itemsSettlementId: Signal<number | undefined>;
	public itemId: Signal<number>;
	public itemName: Signal<string | undefined>;
	public itemUoMId: Signal<number | undefined>;
	public unitName: Signal<string | undefined>;
	public quantityMultiplier: Signal<number>;
	public systemQuantity: Signal<number>;
	public variance: Signal<number>;
	public actualQuantity: Signal<number>;
	public unitCost: Signal<number | undefined>;

	constructor(dto: Partial<StocktakingItemDto> | undefined)
	{
		super(dto, [{
			field: "itemId",
			selector: (d) => d.itemId,
			validators: [Validators.required(i18n.t("stocking:items.itemRequired", "المادة مطلوبة"))]
		}, {
			field: "itemUoMId",
			selector: (d) => d.itemUoMId,
			validators: [Validators.required(i18n.t("stocking:items.unitRequired"))]
		}, {
			field: "quantityMultiplier",
			selector: (d) => d.quantityMultiplier,
			validators: [Validators.min(0.0001, i18n.t("stocking:items.quantityMultiplierMin"))]
		}, {
			field: "actualQuantity",
			selector: (d) => d.actualQuantity,
			validators: [Validators.min(0, i18n.t("stocking:items.unitPriceMin"))]
		}, {
			field: "unitCost",
			selector: (d) => d.unitCost,
			validators: [
				Validators.custom((val, form) =>
				{
					if (form.variance > 0)
					{
						return val !== undefined && val >= 0;
					}
					return true;
				}, i18n.t("stocking:items.unitCostRequired", "سعر التكلفة مطلوب للكميات الزائدة"))
			]
		}], ChangeableEntityMode.Create);

		this.stocktakingId = this.assign("stocktakingId", dto?.stocktakingId ?? 0);
		this.itemsSettlementId = this.assign("itemsSettlementId", dto?.itemsSettlementId ?? 0);
		this.itemId = this.assign("itemId", dto?.itemId ?? 0);
		this.itemName = this.assign("itemName", dto?.itemName ?? "");
		this.itemUoMId = this.assign("itemUoMId", dto?.itemUoMId ?? 0);
		this.unitName = this.assign("unitName", dto?.unitName ?? "");
		this.quantityMultiplier = this.assign("quantityMultiplier", dto?.quantityMultiplier ?? 0);
		this.systemQuantity = this.assign("systemQuantity", dto?.systemQuantity ?? 0);
		this.variance = this.assign("variance", dto?.variance ?? 0);
		this.actualQuantity = this.assign("actualQuantity", dto?.actualQuantity ?? 0);
		this.unitCost = this.assign("unitCost", dto?.unitCost);
	}
}