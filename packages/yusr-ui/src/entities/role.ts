import type { Signal } from "@preact/signals-react";
import { i18n } from "../locales";
import { ChangeableEntity, ChangeableEntityMode, Dto } from "../stateManager";
import { Validators } from "../validation";


export class RoleDto extends Dto
{
	public name!: string;
	public permissions!: string[];
}

export abstract class Role<TRoleDto extends RoleDto> extends ChangeableEntity<TRoleDto>
{
	public name: Signal<string>;
	public permissions: Signal<string[]>;

	constructor(
		dto: Partial<TRoleDto> | undefined,
		mode: ChangeableEntityMode = ChangeableEntityMode.Create
	)
	{
		super(dto, [{
			field: "name",
			selector: (d) => d.name,
			validators: [Validators.required(i18n.t("commonEntities:roles.nameRequired"))]
		}], mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.permissions = this.assign("permissions", dto?.permissions ?? []);
	}
}
