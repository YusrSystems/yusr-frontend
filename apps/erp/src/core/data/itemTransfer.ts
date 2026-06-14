import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { ItemUnitPricingMethod, type ItemUnitPricingMethodDto } from "./itemUnitPricingMethod";

export class ItemTransfersItemDto extends Dto
{
  public itemTransferId!: number;
  public itemId!: number;
  public itemName!: string;
  public itemUnitPricingMethodId!: number;
  public itemUnitPricingMethodName!: string;
  public quantity!: number;
  public maxQuantity!: number;
  public itemUnitPricingMethods: ItemUnitPricingMethodDto[] = [];
}

export class ItemTransfersItem extends ChangeableEntity<ItemTransfersItemDto>
{
  public itemTransferId: Signal<number>;
  public itemId: Signal<number>;
  public itemName: Signal<string>;
  public itemUnitPricingMethodId: Signal<number>;
  public itemUnitPricingMethodName: Signal<string>;
  public quantity: Signal<number>;
  public maxQuantity: Signal<number>;
  public itemUnitPricingMethods: Signal<ItemUnitPricingMethod[]>;

  constructor(dto?: Partial<ItemTransfersItemDto> | undefined)
  {
    super(dto, []);

    this.itemTransferId = this.assign("itemTransferId", dto?.itemTransferId ?? 0);
    this.itemId = this.assign("itemId", dto?.itemId ?? 0);
    this.itemName = this.assign("itemName", dto?.itemName ?? "");
    this.itemUnitPricingMethodId = this.assign("itemUnitPricingMethodId", dto?.itemUnitPricingMethodId ?? 0);
    this.itemUnitPricingMethodName = this.assign("itemUnitPricingMethodName", dto?.itemUnitPricingMethodName ?? "");
    this.quantity = this.assign("quantity", dto?.quantity ?? 0);
    this.maxQuantity = this.assign("maxQuantity", dto?.maxQuantity ?? 0);
    this.itemUnitPricingMethods = this.assign(
      "itemUnitPricingMethods",
      (dto?.itemUnitPricingMethods ?? []).map((m) =>
        m instanceof ItemUnitPricingMethod ? m : new ItemUnitPricingMethod(m)
      )
    );
  }
}

export class ItemTransferDto extends Dto
{
  public description?: string;
  public transferDate!: string | Date;
  public fromStoreId!: number;
  public fromStoreName?: string;
  public toStoreId!: number;
  public toStoreName?: string;
  public itemTransfersItems!: ItemTransfersItemDto[];
}

export default class ItemTransfer extends ChangeableEntity<ItemTransferDto>
{
  public description: Signal<string | undefined>;
  public transferDate: Signal<string>;
  public fromStoreId: Signal<number | undefined>;
  public fromStoreName: Signal<string | undefined>;
  public toStoreId: Signal<number | undefined>;
  public toStoreName: Signal<string | undefined>;
  public itemTransfersItems: Signal<ItemTransfersItem[]>;

  constructor(dto?: Partial<ItemTransferDto> | undefined, mode: ChangeableEntityMode = "create")
  {
    super(dto, [{
      field: "transferDate",
      selector: (d) => d.transferDate,
      validators: [Validators.required(i18n.t("stocking:itemTransfers.transferDateRequired"))]
    }, {
      field: "fromStoreId",
      selector: (d) => d.fromStoreId,
      validators: [Validators.required(i18n.t("stocking:itemTransfers.fromStoreRequired"))]
    }, {
      field: "toStoreId",
      selector: (d) => d.toStoreId,
      validators: [
        Validators.required(i18n.t("stocking:itemTransfers.toStoreRequired")),
        Validators.custom(
          (val, formData) => val !== formData.fromStoreId,
          i18n.t("stocking:itemTransfers.sameStoreError")
        )
      ]
    }, {
      field: "itemTransfersItems",
      selector: (d) => d.itemTransfersItems,
      validators: [Validators.arrayMinLength(1, i18n.t("stocking:itemTransfers.itemsRequired"))]
    }], mode);

    this.description = this.assign("description", dto?.description ?? undefined);
    this.transferDate = this.assign("transferDate", dto?.transferDate ?? new Date().toLocaleDateString("en-CA"));
    this.fromStoreId = this.assign("fromStoreId", dto?.fromStoreId ?? undefined);
    this.fromStoreName = this.assign("fromStoreName", dto?.fromStoreName ?? undefined);
    this.toStoreId = this.assign("toStoreId", dto?.toStoreId ?? undefined);
    this.toStoreName = this.assign("toStoreName", dto?.toStoreName ?? undefined);
    const itemsList = (dto?.itemTransfersItems ?? []).map((s) => new ItemTransfersItem(s));
    this.itemTransfersItems = this.assign("itemTransfersItems", itemsList);
  }
}
