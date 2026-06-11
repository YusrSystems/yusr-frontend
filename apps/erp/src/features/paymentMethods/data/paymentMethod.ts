import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
const CommissionType = {
  Percent: 1,
  Amount: 2
} as const;

export type CommissionType = typeof CommissionType[keyof typeof CommissionType];

export class PaymentMethodDto extends Dto
{
  name!: string;
  accountId!: number;
  accountName!: string;
  commissionType!: CommissionType;
  commissionAmount!: number;
}

export class PaymentMethod extends ChangeableEntity<PaymentMethodDto>
{
  declare name: Signal<string>;
  declare accountId: Signal<number>;
  declare accountName: Signal<string>;
  declare commissionType: Signal<CommissionType>;
  declare commissionAmount: Signal<number>;

  constructor(dto: PaymentMethodDto, mode: ChangeableEntityMode = "create")
  {
    super(dto, [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("accounting:paymentMethods.nameRequired"))]
    }, {
      field: "accountId",
      selector: (d) => d.accountId,
      validators: [Validators.required(i18n.t("accounting:paymentMethods.accountRequired"))]
    }, {
      field: "commissionType",
      selector: (d) => d.commissionType,
      validators: [Validators.required(i18n.t("accounting:paymentMethods.commissionTypeRequired"))]
    }, {
      field: "commissionAmount",
      selector: (d) => d.commissionAmount,
      validators: [Validators.required(i18n.t("accounting:paymentMethods.commissionValueRequired"))]
    }], mode);
  }

  protected initialValue(dto?: Partial<PaymentMethodDto> | undefined): PaymentMethodDto
  {
    return {
      id: dto?.id ?? 0,
      name: dto?.name ?? "",
      accountId: dto?.accountId ?? 0,
      accountName: dto?.accountName ?? "",
      commissionType: dto?.commissionType ?? CommissionType.Percent,
      commissionAmount: dto?.commissionAmount ?? 0
    };
  }
}
