import type { Signal } from "@preact/signals-react";
import { i18n } from "../locales/i18n";
import { Dto, type EntityMode, ValidatableEntity } from "../stateManager";
import { Validators } from "../validation";
export class LoginRequestOld
{
  public companyEmail!: string;
  public username!: string;
  public password!: string;

  constructor(init?: Partial<LoginRequestOld>)
  {
    Object.assign(this, init);
  }
}

export class LoginRequestDto extends Dto
{
  public companyEmail!: string;
  public username!: string;
  public password!: string;
}

export class LoginRequest extends ValidatableEntity<LoginRequestDto>
{
  declare companyEmail: Signal<string>;
  declare username: Signal<string>;
  declare password: Signal<string>;

  constructor(dto: Partial<LoginRequestDto>, mode: EntityMode)
  {
    super(dto, mode, [{
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
  }
}
