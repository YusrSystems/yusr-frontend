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
  declare itemId: Signal<number>;
  declare taxId: Signal<number>;
  declare taxName: Signal<string | undefined>;
  declare taxPercentage: Signal<number | undefined>;

  initialValue(dto?: Partial<ItemTaxDto> | undefined): ItemTaxDto
  {
    return {
      id: 0,
      itemId: 0,
      taxId: undefined,
      taxName: undefined,
      taxPercentage: 0,
      ...dto
    };
  }

  constructor(dto: ItemTaxDto)
  {
    super(dto, [{
      field: "taxId",
      selector: (d) => d.taxId,
      validators: [Validators.required(i18n.t("stocking:items.taxRequired"))]
    }]);
  }
}
