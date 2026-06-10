import { Signal, signal } from "@preact/signals-react";
import type { ValidationRule } from "../validation";
import type { Dto } from "./dto";
import { ValidatableEntity } from "./validatableEntity";

export type ChangeableEntityMode = "create" | "update";

export abstract class ChangeableEntity<TDto extends Dto> extends ValidatableEntity<TDto>
{
  public readonly mode: Signal<ChangeableEntityMode>;
  public readonly isDirty: Signal<boolean> = signal(false);

  protected constructor(
    dto: Partial<TDto>,
    validationRules: ValidationRule<Partial<TDto>>[],
    mode: ChangeableEntityMode = "create"
  )
  {
    super(dto, validationRules);
    this.mode = signal(mode);
  }

  protected onFieldChange(field: keyof TDto, newValue: any): void
  {
    this.isDirty.value = true;
    super.onFieldChange(field, newValue);
  }

  static create<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
    this: new(dto: Partial<TDto>, mode: ChangeableEntityMode) => TEntity,
    dto: Partial<TDto> = {}
  ): TEntity
  {
    return new this(dto, "create");
  }

  static load<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
    this: new(dto: Partial<TDto>, mode: ChangeableEntityMode) => TEntity,
    dto: Partial<TDto>
  ): TEntity
  {
    return new this(dto, "update");
  }

  resetDirty()
  {
    this.isDirty.value = false;
  }
}
