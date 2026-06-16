import type { Signal } from "@preact/signals-react";
import { i18n } from "../locales/i18n";
import { Dto, ValidatableEntity } from "../stateManager";
import { Validators } from "../validation";


export class LoginRequestDto extends Dto
{
	public companyEmail!: string;
	public username!: string;
	public password!: string;
}

export class LoginRequest extends ValidatableEntity<LoginRequestDto>
{
	public companyEmail: Signal<string>;
	public username: Signal<string>;
	public password: Signal<string>;

	constructor(dto: Partial<LoginRequestDto>)
	{
		super(dto, [{
			field: "companyEmail",
			selector: (d) => d.companyEmail,
			validators: [Validators.required(i18n.t("login:email.required"))]
		}, {
			field: "username",
			selector: (d) => d.username,
			validators: [Validators.required(i18n.t("login:username.required"))]
		}, {
			field: "password",
			selector: (d) => d.password,
			validators: [Validators.required(i18n.t("login:password.required"))]
		}]);

		this.companyEmail = this.assign("companyEmail", dto.companyEmail);
		this.username = this.assign("username", dto.username);
		this.password = this.assign("password", dto.password);
	}
}