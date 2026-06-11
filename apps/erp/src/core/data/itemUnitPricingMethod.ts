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
  declare itemId: Signal<number | undefined>;
  declare unitId: Signal<number | undefined>;
  declare itemUnitPricingMethodName: Signal<string>;
  declare unitName: Signal<string | undefined>;
  declare pricingMethodId: Signal<number>;
  declare pricingMethodName: Signal<string | undefined>;
  declare quantityMultiplier: Signal<number>;
  declare unitPrice: Signal<number>;
  declare price: Signal<number>;
  declare barcode: Signal<string | undefined>;

  initialValue(dto?: Partial<ItemUnitPricingMethodDto> | undefined): ItemUnitPricingMethodDto
  {
    return {
      id: 0,
      itemId: undefined,
      unitId: undefined,
      itemUnitPricingMethodName: undefined,
      unitName: undefined,
      pricingMethodId: undefined,
      pricingMethodName: undefined,
      quantityMultiplier: 1,
      unitPrice: 0,
      price: 0,
      barcode: ItemUnitPricingMethod.generateBarcode(),
      ...dto
    };
  }

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
