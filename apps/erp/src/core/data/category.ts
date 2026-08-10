import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { Signal } from "@preact/signals-react";


export class CategoryDto extends Dto
{
	public name!: string;
	public parentCategoryId?: number;
	public parentCategoryName?: string;
}

export class Category extends ChangeableEntity<CategoryDto>
{
	public name: Signal<string>;
	public parentCategoryId: Signal<number | undefined>;
	public parentCategoryName: Signal<string | undefined>;

	constructor(dto?: Partial<CategoryDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [
			{
				field: "name",
				selector: d => d.name,
				validators: [Validators.required(i18n.t("stocking:items.nameRequired", "الاسم مطلوب"))]
			}
		], mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.parentCategoryId = this.assign("parentCategoryId", dto?.parentCategoryId);
		this.parentCategoryName = this.assign("parentCategoryName", dto?.parentCategoryName);
	}
}