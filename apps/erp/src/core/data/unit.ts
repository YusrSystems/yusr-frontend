import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";

export class UnitDto extends Dto
{
  public name!: string;
}

export default class Unit extends ChangeableEntity<UnitDto>
{
  public name: Signal<string>;

  constructor(dto?: Partial<UnitDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
  {
    super(dto, [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("stocking:units.nameRequired"))]
    }], mode);

    this.name = this.assign("name", dto?.name ?? "");
  }
}
