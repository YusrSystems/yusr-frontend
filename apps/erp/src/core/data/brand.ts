import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { Signal } from "@preact/signals-react";


export class BrandDto extends Dto
{
	public name!: string;
}

export class Brand extends ChangeableEntity<BrandDto>
{
	public name: Signal<string>;

	constructor(dto?: Partial<BrandDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [
			{
				field: "name",
				selector: d => d.name,
				validators: [Validators.required(i18n.t("stocking:items.nameRequired", "الاسم مطلوب"))]
			}
		], mode);

		this.name = this.assign("name", dto?.name ?? "");
	}
}