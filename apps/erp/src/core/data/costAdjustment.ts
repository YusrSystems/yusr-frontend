import type { Signal } from "@preact/signals-react";
import {
	ChangeableEntity,
	ChangeableEntityMode,
	DateService,
	Dto,
	i18n,
	type ValidationRule,
	Validators
} from "yusr-ui";


export class CostAdjustmentDto extends Dto
{
	public date!: string;
	public itemId!: number;
	public itemName!: string;
	public oldCost!: number;
	public newCost!: number;
	public quantity!: number;
	public notes?: string;
	public createdBy!: number;
	public createdAt!: string | Date;
}

export default class CostAdjustment extends ChangeableEntity<CostAdjustmentDto>
{
	public date: Signal<string>;
	public itemId: Signal<number>;
	public itemName: Signal<string>;
	public oldCost: Signal<number>;
	public newCost: Signal<number>;
	public quantity: Signal<number>;
	public notes: Signal<string | undefined>;
	public createdBy: Signal<number>;
	public createdAt: Signal<string | Date>;

	constructor(dto?: Partial<CostAdjustmentDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		const rules: ValidationRule<Partial<CostAdjustmentDto>>[] = [
			{
				field: "date",
				selector: (d) => d.date,
				validators: [Validators.required(i18n.t("stocking:costAdjustments.dateRequired"))]
			},
			{
				field: "itemId",
				selector: (d) => d.itemId,
				validators: [Validators.required(i18n.t("stocking:costAdjustments.itemRequired"))]
			},
			{
				field: "newCost",
				selector: (d) => d.newCost,
				validators: [
					Validators.required(i18n.t("stocking:costAdjustments.newCostRequired")),
					Validators.min(0, i18n.t("stocking:costAdjustments.newCostMin"))
				]
			}
		];

		super(dto, rules, mode);

		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.itemId = this.assign("itemId", dto?.itemId ?? undefined);
		this.itemName = this.assign("itemName", dto?.itemName ?? "");
		this.oldCost = this.assign("oldCost", dto?.oldCost ?? 0);
		this.newCost = this.assign("newCost", dto?.newCost ?? 0);
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
		this.notes = this.assign("notes", dto?.notes);
		this.createdBy = this.assign("createdBy", dto?.createdBy ?? 0);
		this.createdAt = this.assign("createdAt", dto?.createdAt ?? new Date());
	}
}