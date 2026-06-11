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
  declare description: Signal<string>;
  declare date: Signal<string | Date>;
  declare amount: Signal<number>;
  declare fromAccountId: Signal<number>;
  declare toAccountId: Signal<number>;
  declare fromAccountName: Signal<string>;
  declare toAccountName: Signal<string>;

  constructor(dto: BalanceTransferDto, mode: ChangeableEntityMode = "create")
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
  }

  protected initialValue(dto?: Partial<BalanceTransferDto> | undefined): BalanceTransferDto
  {
    return {
      id: dto?.id ?? 0,
      description: dto?.description ?? "",
      date: dto?.date ?? new Date(),
      amount: dto?.amount ?? 0,
      fromAccountId: dto?.fromAccountId ?? 0,
      toAccountId: dto?.toAccountId ?? 0
    };
  }
}
