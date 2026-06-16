import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, type ValidationRule, Validators } from "yusr-ui";


export class TaxDto extends Dto
{
	public name!: string;
	public percentage!: number;
	public isPrimary!: boolean;
}

export class Tax extends ChangeableEntity<TaxDto>
{
	public name: Signal<string>;
	public percentage: Signal<number>;
	public isPrimary: Signal<boolean>;

	constructor(dto?: Partial<TaxDto> | undefined, mode: ChangeableEntityMode = "create")
	{
		const rules: ValidationRule<Partial<TaxDto>>[] = [{
			field: "name",
			selector: (d) => d.name,
			validators: [Validators.required(i18n.t("accounting:taxes.nameRequired"))]
		}, {
			field: "percentage",
			selector: (d) => d.percentage,
			validators: [
				Validators.required(i18n.t("accounting:taxes.percentageRequired")),
				Validators.min(1, i18n.t("accounting:taxes.percentageMin")),
				Validators.max(100, i18n.t("accounting:taxes.percentageMax"))
			]
		}];

		super(dto, rules, mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.percentage = this.assign("percentage", dto?.percentage ?? 0);
		this.isPrimary = this.assign("isPrimary", dto?.isPrimary ?? true);
	}
}
