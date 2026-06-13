import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, Dto, i18n, Validators } from "yusr-ui";

export class StocktakingItemDto extends Dto
{
  public stocktakingId?: number;
  public itemId!: number;
  public itemName?: string;
  public itemUnitPricingMethodId?: number;
  public itemUnitPricingMethodName?: string;
  public quantityMultiplier!: number;
  public systemQuantity!: number;
  public variance!: number;
  public actualQuantity!: number;
}

export class StocktakingItem extends ChangeableEntity<StocktakingItemDto>
{
  declare stocktakingId: Signal<number | undefined>;
  declare itemId: Signal<number>;
  declare itemName: Signal<string | undefined>;
  declare itemUnitPricingMethodId: Signal<number | undefined>;
  declare itemUnitPricingMethodName: Signal<string | undefined>;
  declare quantityMultiplier: Signal<number>;
  declare systemQuantity: Signal<number>;
  declare variance: Signal<number>;
  declare actualQuantity: Signal<number>;

  initialValue(dto?: Partial<StocktakingItemDto> | undefined): StocktakingItemDto
  {
    return {
      id: 0,
      stocktakingId: undefined,
      itemId: 0,
      itemName: undefined,
      itemUnitPricingMethodId: undefined,
      itemUnitPricingMethodName: undefined,
      quantityMultiplier: 1,
      systemQuantity: 0,
      variance: 0,
      actualQuantity: 0,
      ...dto
    };
  }

  constructor(dto: StocktakingItemDto)
  {
    super(dto, [{
      field: "itemId",
      selector: (d) => d.itemId,
      validators: [Validators.required(i18n.t("stocking:items.unitRequired"))]
    }, {
      field: "itemUnitPricingMethodId",
      selector: (d) => d.itemUnitPricingMethodId,
      validators: [Validators.required(i18n.t("stocking:items.pricingMethodRequired"))]
    }, {
      field: "quantityMultiplier",
      selector: (d) => d.quantityMultiplier,
      validators: [Validators.min(1, i18n.t("stocking:items.quantityMultiplierMin"))]
    }, {
      field: "actualQuantity",
      selector: (d) => d.actualQuantity,
      validators: [Validators.min(0, i18n.t("stocking:items.unitPriceMin"))]
    }]);
  }
}
