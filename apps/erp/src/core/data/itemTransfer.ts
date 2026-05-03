import { BaseEntity, type ColumnName, type ValidationRule, Validators } from "yusr-ui";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "yusr-ui";
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
  public static columnsNames: ColumnName<ItemTransfer>[] = [
    { label: "رقم التحويل", value: "id" },
    { label: "المستودع المحول منه", value: "fromStoreName" },
    { label: "المستودع المحول إليه", value: "toStoreName" },
    { label: "الوصف", value: "description" }
  ];
}

export class ItemTransferValidationRules
{
  public static validationRules: ValidationRule<Partial<ItemTransfer>>[] = [{
    field: "transferDate",
    selector: (d) => d.transferDate,
    validators: [Validators.required("يرجى إدخال تاريخ التحويل")]
  }, {
    field: "fromStoreId",
    selector: (d) => d.fromStoreId,
    validators: [Validators.required("يرجى اختيار المستودع المحول منه")]
  }, {
    field: "toStoreId",
    selector: (d) => d.toStoreId,
    validators: [
      Validators.required("يرجى اختيار المستودع المحول إليه"),
      Validators.custom(
        (val, formData) => val !== formData.fromStoreId,
        "لا يمكن التحويل لنفس المستودع"
      )
    ]
  }, {
    field: "itemTransfersItems",
    selector: (d) => d.itemTransfersItems,
    validators: [Validators.arrayMinLength(1, "يرجى إضافة مادة واحدة على الأقل للتحويل")]
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
