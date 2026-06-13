import type { Signal } from "@preact/signals-react";
import { Dto, i18n, ValidatableEntity, type ValidationRule, Validators } from "yusr-ui";
class RegistrationDto extends Dto
{
  public companyName!: string;
  public email!: string;
  public branchName!: string;
  public username!: string;
  public userPassword!: string;
  public currencyId!: number;
}

class Registration extends ValidatableEntity<RegistrationDto>
{
  public companyName: Signal<string>;
  public email: Signal<string>;
  public branchName: Signal<string>;
  public username: Signal<string>;
  public userPassword: Signal<string>;
  public currencyId: Signal<number>;

  constructor(dto?: Partial<RegistrationDto>)
  {
    const rules: ValidationRule<Partial<RegistrationDto>>[] = [{
      field: "companyName",
      selector: (d) => d.companyName,
      validators: [Validators.required(i18n.t("loginRegister:register.companyInfo.companyName.required"))]
    }, {
      field: "email",
      selector: (d) => d.email,
      validators: [Validators.required(i18n.t("loginRegister:register.companyInfo.email.required"))]
    }, {
      field: "branchName",
      selector: (d) => d.branchName,
      validators: [Validators.required(i18n.t("loginRegister:register.companyInfo.branchName.required"))]
    }, {
      field: "username",
      selector: (d) => d.username,
      validators: [Validators.required(i18n.t("loginRegister:register.accountInfo.username.required"))]
    }, {
      field: "userPassword",
      selector: (d) => d.userPassword,
      validators: [Validators.required(i18n.t("loginRegister:register.accountInfo.password.required"))]
    }, {
      field: "currencyId",
      selector: (d) => d.currencyId,
      validators: [Validators.required(i18n.t("loginRegister:register.companyInfo.currency.required"))]
    }];

    super(dto, rules);

    this.companyName = this.assign("companyName", dto?.companyName ?? "");
    this.email = this.assign("email", dto?.email ?? "");
    this.branchName = this.assign("branchName", dto?.branchName ?? "");
    this.username = this.assign("username", dto?.username ?? "");
    this.userPassword = this.assign("userPassword", dto?.userPassword ?? "");
    this.currencyId = this.assign("currencyId", dto?.currencyId ?? 0);
  }
}

export { Registration, RegistrationDto };
