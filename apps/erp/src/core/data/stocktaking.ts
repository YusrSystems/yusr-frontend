import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import type { IStocktakingItem, StocktakingItem, StocktakingItemDto } from "./stocktakingItem";

export interface IStocktaking<TDto extends Dto> extends ChangeableEntity<TDto>
{
  mode: Signal<ChangeableEntityMode>;
  description: Signal<string | undefined>;
  date: Signal<string>;
  storeId: Signal<number | undefined>;
  storeName: Signal<string | undefined>;
  stocktakingItems: Signal<IStocktakingItem[]>;
}

export class StocktakingDto extends Dto
{
  public description?: string;
  public date!: string;
  public storeId?: number;
  public storeName?: string;
  public stocktakingItems: StocktakingItemDto[] = [];
}

export default class Stocktaking extends ChangeableEntity<StocktakingDto> implements IStocktaking<StocktakingDto>
{
  declare description: Signal<string | undefined>;
  declare date: Signal<string>;
  declare storeId: Signal<number | undefined>;
  declare storeName: Signal<string | undefined>;
  declare stocktakingItems: Signal<StocktakingItem[]>;

  initialValue(dto?: Partial<StocktakingDto> | undefined): StocktakingDto
  {
    return {
      id: 0,
      description: undefined,
      date: new Date().toLocaleDateString("en-CA"),
      storeId: undefined,
      storeName: undefined,
      stocktakingItems: [],
      ...dto
    };
  }

  constructor(dto: StocktakingDto)
  {
    super(dto, [{
      field: "storeId",
      selector: (d) => d.storeId,
      validators: [Validators.required(i18n.t("stocking:stocktakings.storeRequired"))]
    }, {
      field: "date",
      selector: (d) => d.date,
      validators: [Validators.required(i18n.t("stocking:stocktakings.dateRequired"))]
    }, {
      field: "stocktakingItems",
      selector: (d) => d.stocktakingItems,
      validators: [Validators.arrayMinLength(1, i18n.t("stocking:stocktakings.itemsRequired"))]
    }]);
  }
}
