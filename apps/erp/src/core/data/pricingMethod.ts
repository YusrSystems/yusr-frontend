import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";

export class PricingMethodDto extends Dto
{
  public name!: string;
}

export default class PricingMethod extends ChangeableEntity<PricingMethodDto>
{
  protected initialValue(dto?: Partial<PricingMethodDto> | undefined): PricingMethodDto
  {
    return { id: 0, name: "", ...dto };
  }

  declare name: Signal<string>;

  constructor(dto: PricingMethodDto, mode: ChangeableEntityMode = "create")
  {
    super(dto, [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("stocking:pricingMethods.nameRequired"))]
    }], mode);
  }
}
