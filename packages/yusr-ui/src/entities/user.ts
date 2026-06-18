import type { Signal } from "@preact/signals-react";
import { i18n } from "../locales";
import { ChangeableEntity, ChangeableEntityMode, Dto } from "../stateManager";
import { type ValidationRule, Validators } from "../validation";
import { RoleDto } from "./role";


export class UserDto extends Dto
{
	public username!: string;
	public password!: string;
	public isActive!: boolean;
	public branchId?: number;
	public branchName?: string;
	public roleId?: number;
	public roleName?: string;
	public role?: RoleDto;
}

export class User extends ChangeableEntity<UserDto>
{
	public username: Signal<string>;
	public password: Signal<string>;
	public isActive: Signal<boolean>;
	public branchId: Signal<number>;
	public branchName: Signal<string>;
	public roleId: Signal<number>;
	public roleName: Signal<string>;
	public role: Signal<RoleDto>;

	constructor(dto: Partial<UserDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		const rules: ValidationRule<Partial<UserDto>>[] = [{
			field: "username",
			selector: (d) => d.username,
			validators: [Validators.required(i18n.t("commonEntities:users.usernameRequired"))]
		}, {
			field: "password",
			selector: (d) => d.password,
			validators: [Validators.required(i18n.t("commonEntities:users.passwordRequired"))]
		}, {
			field: "roleId",
			selector: (d) => d.roleId,
			validators: [Validators.required(i18n.t("commonEntities:users.roleRequired"))]
		}, {
			field: "branchId",
			selector: (d) => d.branchId,
			validators: [Validators.required(i18n.t("commonEntities:users.branchRequired"))]
		}];

		super(dto, rules, mode);

		this.username = this.assign("username", dto?.username ?? "");
		this.password = this.assign("password", dto?.password ?? "");
		this.isActive = this.assign("isActive", dto?.isActive ?? false);
		this.branchId = this.assign("branchId", dto?.branchId ?? 0);
		this.branchName = this.assign("branchName", dto?.branchName ?? "");
		this.roleId = this.assign("roleId", dto?.roleId ?? 0);
		this.roleName = this.assign("roleName", dto?.roleName ?? "");
		this.role = this.assign("role", dto?.role ?? undefined);
	}
}
