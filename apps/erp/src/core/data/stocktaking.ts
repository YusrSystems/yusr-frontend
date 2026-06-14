import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { StocktakingItem, type StocktakingItemDto } from "./stocktakingItem";

export class StocktakingDto extends Dto
{
  public description?: string;
  public date!: string;
  public storeId?: number;
  public storeName?: string;
  public items: StocktakingItemDto[] = [];
}

export default class Stocktaking extends ChangeableEntity<StocktakingDto>
{
  public description: Signal<string | undefined>;
  public date: Signal<string>;
  public storeId: Signal<number | undefined>;
  public storeName: Signal<string | undefined>;
  public items: Signal<StocktakingItem[]>;
  constructor(dto: Partial<StocktakingDto> | undefined, mode: ChangeableEntityMode = "create")
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
      field: "items",
      selector: (d) => d.items,
      validators: [Validators.arrayMinLength(1, i18n.t("stocking:stocktakings.itemsRequired"))]
    }], mode);

    this.description = this.assign("description", dto?.description ?? "");
    this.date = this.assign("date", dto?.date ?? "");
    this.storeId = this.assign("storeId", dto?.storeId ?? 0);
    this.storeName = this.assign("storeName", dto?.storeName ?? "");
    const itemsList = (dto?.items ?? []).map((s) => new StocktakingItem(s));
    this.items = this.assign("items", itemsList);
  }
}
