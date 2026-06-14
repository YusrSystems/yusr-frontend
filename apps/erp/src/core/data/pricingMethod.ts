import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";

export class PricingMethodDto extends Dto
{
  public name!: string;
}

export default class PricingMethod extends ChangeableEntity<PricingMethodDto>
{
  public name: Signal<string>;

  constructor(dto: Partial<PricingMethodDto> | undefined, mode: ChangeableEntityMode = "create")
  {
    super(dto, [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("stocking:pricingMethods.nameRequired"))]
    }], mode);

    this.name = this.assign("name", dto?.name ?? "");
  }
}
