import type { Signal } from "@preact/signals-react";
import { i18n } from "../locales";
import { ChangeableEntity, ChangeableEntityMode, Dto, Entity } from "../stateManager";
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
	public userMetadata?: UserMetadataDto;

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
	public userMetadata: Signal<UserMetadata>;

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
		this.isActive = this.assign("isActive", dto?.isActive ?? true);
		this.branchId = this.assign("branchId", dto?.branchId);
		this.branchName = this.assign("branchName", dto?.branchName);
		this.roleId = this.assign("roleId", dto?.roleId);
		this.roleName = this.assign("roleName", dto?.roleName);
		this.role = this.assign("role", dto?.role);
		this.userMetadata = this.assign("userMetadata", new UserMetadata(dto?.userMetadata ?? {}));
	}
}

class UserMetadataDto extends Dto
{
	public connectedEmail?: string;
}

export class UserMetadata extends Entity<UserMetadataDto>
{
	public connectedEmail: Signal<string | undefined>;

	constructor(dto: Partial<UserMetadataDto>)
	{
		super();
		this.connectedEmail = this.assign("connectedEmail", dto?.connectedEmail);
	}
}