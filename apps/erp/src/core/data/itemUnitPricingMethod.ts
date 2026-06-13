import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, Dto, i18n, Validators } from "yusr-ui";

export class ItemUnitPricingMethodDto extends Dto
{
  public itemId?: number;
  public unitId?: number;
  public itemUnitPricingMethodName?: string;
  public unitName?: string;
  public pricingMethodId?: number;
  public pricingMethodName?: string;
  public quantityMultiplier!: number;
  public unitPrice!: number;
  public price!: number;
  public barcode?: string;
}

export class ItemUnitPricingMethod extends ChangeableEntity<ItemUnitPricingMethodDto>
{
  public itemId: Signal<number | undefined>;
  public unitId: Signal<number | undefined>;
  public itemUnitPricingMethodName: Signal<string>;
  public unitName: Signal<string | undefined>;
  public pricingMethodId: Signal<number>;
  public pricingMethodName: Signal<string | undefined>;
  public quantityMultiplier: Signal<number>;
  public unitPrice: Signal<number>;
  public price: Signal<number>;
  public barcode: Signal<string | undefined>;

  constructor(dto: ItemUnitPricingMethodDto)
  {
    super(dto, [{
      field: "unitId",
      selector: (d) => d.unitId,
      validators: [Validators.required(i18n.t("stocking:items.unitRequired"))]
    }, {
      field: "pricingMethodId",
      selector: (d) => d.pricingMethodId,
      validators: [Validators.required(i18n.t("stocking:items.pricingMethodRequired"))]
    }, {
      field: "quantityMultiplier",
      selector: (d) => d.quantityMultiplier,
      validators: [Validators.min(1, i18n.t("stocking:items.quantityMultiplierMin"))]
    }, {
      field: "unitPrice",
      selector: (d) => d.unitPrice,
      validators: [Validators.min(0, i18n.t("stocking:items.unitPriceMin"))]
    }, {
      field: "itemUnitPricingMethodName",
      selector: (d) => d.itemUnitPricingMethodName,
      validators: [Validators.required(i18n.t("stocking:items.itemUnitPricingMethodNameRequired"))]
    }]);
    this.itemId = this.assign("itemId", dto.itemId ?? 0);
    this.unitId = this.assign("unitId", dto.unitId ?? 0);
    this.itemUnitPricingMethodName = this.assign("itemUnitPricingMethodName", dto.itemUnitPricingMethodName ?? "");
    this.unitName = this.assign("unitName", dto.unitName ?? "");
    this.pricingMethodId = this.assign("pricingMethodId", dto.pricingMethodId ?? 0);
    this.pricingMethodName = this.assign("pricingMethodName", dto.pricingMethodName ?? "");
    this.quantityMultiplier = this.assign("quantityMultiplier", dto.quantityMultiplier ?? 0);
    this.unitPrice = this.assign("unitPrice", dto.unitPrice ?? 0);
    this.price = this.assign("price", dto.price ?? 0);
    this.barcode = this.assign("barcode", dto.barcode ?? "");
  }

  generateBarcode(length = 12): void
  {
    this.barcode.value = ItemUnitPricingMethod.generateBarcode(length);
  }

  static generateBarcode(length = 12)
  {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  }
}
