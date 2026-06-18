import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, type ValidationRule, Validators } from "yusr-ui";


export class StoreDto extends Dto
{
	public name!: string;
	public authorized!: boolean;
}

export class Store extends ChangeableEntity<StoreDto>
{
	public name: Signal<string>;
	public authorized: Signal<boolean>;

	constructor(dto?: Partial<StoreDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		const rules: ValidationRule<Partial<StoreDto>>[] = [{
			field: "name",
			selector: (d) => d.name,
			validators: [Validators.required(i18n.t("stocking:stores.nameRequired"))]
		}];

		super(dto, rules, mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.authorized = this.assign("authorized", dto?.authorized ?? false);
	}
}
