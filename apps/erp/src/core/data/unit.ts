import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";

export class UnitDto extends Dto
{
  public name!: string;
}

export default class Unit extends ChangeableEntity<UnitDto>
{
  declare name: Signal<string>;

  constructor(dto: Partial<UnitDto>, mode: ChangeableEntityMode = "create")
  {
    super({ id: 0, name: "", ...dto }, [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("stocking:units.nameRequired"))]
    }], mode);
  }
}
