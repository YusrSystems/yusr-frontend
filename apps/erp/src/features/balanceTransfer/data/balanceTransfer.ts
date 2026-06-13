import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";

export class BalanceTransferDto extends Dto
{
  public description?: string;
  public date!: string | Date;
  public amount!: number;
  public fromAccountId!: number;
  public toAccountId!: number;
  public fromAccountName?: string;
  public toAccountName?: string;
}

export class BalanceTransfer extends ChangeableEntity<BalanceTransferDto>
{
  public description: Signal<string>;
  public date: Signal<string | Date>;
  public amount: Signal<number>;
  public fromAccountId: Signal<number>;
  public toAccountId: Signal<number>;
  public fromAccountName: Signal<string>;
  public toAccountName: Signal<string>;

  constructor(dto?: Partial<BalanceTransferDto>, mode: ChangeableEntityMode = "create")
  {
    super(dto, [{
      field: "amount",
      selector: (d) => d.amount,
      validators: [Validators.required(i18n.t("accounting:balanceTransfers.amountRequired"))]
    }, {
      field: "date",
      selector: (d) => d.date,
      validators: [Validators.required(i18n.t("accounting:balanceTransfers.dateRequired"))]
    }, {
      field: "fromAccountId",
      selector: (d) => d.fromAccountId,
      validators: [Validators.required(i18n.t("accounting:balanceTransfers.fromAccountRequired"))]
    }, {
      field: "toAccountId",
      selector: (d) => d.toAccountId,
      validators: [Validators.required(i18n.t("accounting:balanceTransfers.toAccountRequired"))]
    }], mode);

    this.description = this.assign("description", dto?.description ?? "");
    this.date = this.assign("date", dto?.date ?? "");
    this.amount = this.assign("amount", dto?.amount ?? 0.0);
    this.fromAccountId = this.assign("fromAccountId", dto?.fromAccountId ?? 0);
    this.toAccountId = this.assign("toAccountId", dto?.toAccountId ?? 0);
    this.fromAccountName = this.assign("fromAccountName", dto?.fromAccountName ?? "");
    this.toAccountName = this.assign("toAccountName", dto?.toAccountName ?? "");
  }
}
