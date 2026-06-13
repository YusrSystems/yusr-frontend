import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, Dto, i18n, Validators } from "yusr-ui";

export class ItemTaxDto extends Dto
{
  public itemId!: number;
  public taxId?: number;
  public taxName?: string;
  public taxPercentage!: number;
}

export class ItemTax extends ChangeableEntity<ItemTaxDto>
{
  public itemId: Signal<number>;
  public taxId: Signal<number>;
  public taxName: Signal<string | undefined>;
  public taxPercentage: Signal<number | undefined>;

  constructor(dto?: Partial<ItemTaxDto>)
  {
    super(dto, [{
      field: "taxId",
      selector: (d) => d.taxId,
      validators: [Validators.required(i18n.t("stocking:items.taxRequired"))]
    }]);

    this.itemId = this.assign("itemId", dto?.itemId ?? 0);
    this.taxId = this.assign("taxId", dto?.taxId ?? 0);
    this.taxName = this.assign("taxName", dto?.taxName ?? "");
    this.taxPercentage = this.assign("taxPercentage", dto?.taxPercentage ?? 0);
  }
}
