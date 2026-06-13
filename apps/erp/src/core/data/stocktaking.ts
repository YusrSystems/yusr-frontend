import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { StocktakingItem, type StocktakingItemDto } from "./stocktakingItem";

export class StocktakingDto extends Dto
{
  public description?: string;
  public date!: string;
  public storeId?: number;
  public storeName?: string;
  public stocktakingItems: StocktakingItemDto[] = [];
}

export default class Stocktaking extends ChangeableEntity<StocktakingDto>
{
  declare description: Signal<string | undefined>;
  declare date: Signal<string>;
  declare storeId: Signal<number | undefined>;
  declare storeName: Signal<string | undefined>;
  declare stocktakingItems: Signal<StocktakingItem[]>;

  initialValue(dto?: Partial<StocktakingDto> | undefined): StocktakingDto
  {
    return {
      id: dto?.id ?? 0,
      description: dto?.description ?? undefined,
      date: dto?.date ? new Date(dto?.date).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA"),
      storeId: dto?.storeId ?? undefined,
      storeName: dto?.storeName ?? undefined,
      stocktakingItems: dto?.stocktakingItems ?? []
    };
  }

  constructor(dto: StocktakingDto, mode: ChangeableEntityMode = "create")
  {
    super({
      ...dto,
      stocktakingItems: (dto.stocktakingItems ?? []).map((s) =>
        s instanceof StocktakingItem ? s : new StocktakingItem(s)
      ) as unknown[] as StocktakingItemDto[]
    }, [{
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
    }], mode);
  }
}
