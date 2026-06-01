import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import BalanceTransfersApiService from "../networking/balanceTransferApiService";

export default class BalanceTransfer extends BaseEntity
{
  public description?: string;
  public date!: string | Date;
  public amount!: number;
  public fromAccountId!: number;
  public toAccountId!: number;
  public fromAccountName?: string;
  public toAccountName?: string;

  constructor(init?: Partial<BalanceTransfer>)
  {
    super();
    Object.assign(this, init);
  }
}

export class BalanceTransferValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRuleOld<Partial<BalanceTransfer>>[] => [{
    field: "amount",
    selector: (d) => d.amount,
    validators: [Validators.required(t("balanceTransfers.amountRequired"))]
  }, {
    field: "date",
    selector: (d) => d.date,
    validators: [Validators.required(t("balanceTransfers.dateRequired"))]
  }, {
    field: "fromAccountId",
    selector: (d) => d.fromAccountId,
    validators: [Validators.required(t("balanceTransfers.fromAccountRequired"))]
  }, {
    field: "toAccountId",
    selector: (d) => d.toAccountId,
    validators: [Validators.required(t("balanceTransfers.toAccountRequired"))]
  }];
}

export class BalanceTransferSlice
{
  private static entitySliceInstance = createGenericEntitySlice("balanceTransfer", new BalanceTransfersApiService());
  public static entityActions = BalanceTransferSlice.entitySliceInstance.actions;
  public static entityReducer = BalanceTransferSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<BalanceTransfer>("balanceTransferDialog");
  public static dialogActions = BalanceTransferSlice.dialogSliceInstance.actions;
  public static dialogReducer = BalanceTransferSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<BalanceTransfer>("balanceTransferForm");
  public static formActions = BalanceTransferSlice.formSliceInstance.actions;
  public static formReducer = BalanceTransferSlice.formSliceInstance.reducer;
}
