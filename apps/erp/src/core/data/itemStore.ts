import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, Dto, i18n, Validators } from "yusr-ui";

export class ItemStoreDto extends Dto
{
  public itemId!: number;
  public storeId?: number;
  public storeName?: string;
  public initialQuantity!: number;
  public quantity!: number;
}

export class ItemStore extends ChangeableEntity<ItemStoreDto>
{
  declare itemId: Signal<number>;
  declare storeId: Signal<number>;
  declare storeName: Signal<string | undefined>;
  declare initialQuantity: Signal<number>;
  declare quantity: Signal<number>;

  protected initialValue(dto?: Partial<ItemStoreDto> | undefined): ItemStoreDto
  {
    return {
      id: 0,
      itemId: 0,
      storeId: undefined,
      storeName: undefined,
      initialQuantity: 0,
      quantity: 0,
      ...dto
    };
  }

  constructor(dto: ItemStoreDto)
  {
    super(dto, [{
      field: "storeId",
      selector: (d) => d.storeId,
      validators: [Validators.required(i18n.t("stocking:items.storeRequired"))]
    }, {
      field: "initialQuantity",
      selector: (d) => d.initialQuantity,
      validators: [Validators.min(0, i18n.t("stocking:items.initialQuantityMin"))]
    }]);
  }
}
