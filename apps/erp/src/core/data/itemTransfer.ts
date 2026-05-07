import { type TFunction } from "i18next";
import { BaseEntity, type ColumnName, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRule, Validators } from "yusr-ui";
import ItemTransferApiService from "../networking/itemTransferApiService";
import type { ItemUnitPricingMethod } from "./item";

export class ItemTransfersItem extends BaseEntity
{
  public itemTransferId!: number;
  public itemId!: number;
  public itemName!: string;
  public itemUnitPricingMethodId!: number;
  public itemUnitPricingMethodName!: string;
  public quantity!: number;
  public itemUnitPricingMethods: ItemUnitPricingMethod[] = [];

  constructor(init?: Partial<ItemTransfersItem>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class ItemTransfer extends BaseEntity
{
  public description?: string;
  public transferDate: Date = new Date();
  public fromStoreId!: number;
  public fromStoreName: string = "";
  public toStoreId!: number;
  public toStoreName: string = "";
  public itemTransfersItems: ItemTransfersItem[] = [];

  constructor(init?: Partial<ItemTransfer>)
  {
    super();
    Object.assign(this, init);
    if (init?.transferDate)
    {
      this.transferDate = new Date(init.transferDate);
    }
    if (init?.itemTransfersItems)
    {
      this.itemTransfersItems = init.itemTransfersItems.map((i) => new ItemTransfersItem(i));
    }
  }
}

export class ItemTransferFilterColumns
{
  public static columnsNames = (
    t: TFunction<"accounting">
  ): ColumnName<ItemTransfer>[] => [
    { label: t("itemTransfers.transferId"), value: "id" },
    { label: t("itemTransfers.fromStore"), value: "fromStoreName" },
    { label: t("itemTransfers.toStore"), value: "toStoreName" },
    { label: t("itemTransfers.description"), value: "description" }
  ];
}

export class ItemTransferValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRule<Partial<ItemTransfer>>[] => [{
    field: "transferDate",
    selector: (d) => d.transferDate,
    validators: [Validators.required(t("itemTransfers.transferDateRequired"))]
  }, {
    field: "fromStoreId",
    selector: (d) => d.fromStoreId,
    validators: [Validators.required(t("itemTransfers.fromStoreRequired"))]
  }, {
    field: "toStoreId",
    selector: (d) => d.toStoreId,
    validators: [
      Validators.required(t("itemTransfers.toStoreRequired")),
      Validators.custom(
        (val, formData) => val !== formData.fromStoreId,
        t("itemTransfers.sameStoreError")
      )
    ]
  }, {
    field: "itemTransfersItems",
    selector: (d) => d.itemTransfersItems,
    validators: [Validators.arrayMinLength(1, t("itemTransfers.itemsRequired"))]
  }];
}

export class ItemTransferSlice
{
  private static entitySliceInstance = createGenericEntitySlice("itemTransfer", new ItemTransferApiService());
  public static entityActions = ItemTransferSlice.entitySliceInstance.actions;
  public static entityReducer = ItemTransferSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<ItemTransfer>("itemTransferDialog");
  public static dialogActions = ItemTransferSlice.dialogSliceInstance.actions;
  public static dialogReducer = ItemTransferSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<ItemTransfer>("itemTransferForm");
  public static formActions = ItemTransferSlice.formSliceInstance.actions;
  public static formReducer = ItemTransferSlice.formSliceInstance.reducer;
}
