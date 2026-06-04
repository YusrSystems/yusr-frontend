import type { ValidationRule } from "../validation";
import { Signal, signal } from "@preact/signals-react";
import type { Dto } from "./dto";
import { ValidatableEntity } from "./validatableEntity";

export type ChangeableEntityMode = "create" | "update";

export abstract class ChangeableEntity<TDto extends Dto> extends ValidatableEntity<TDto>
{
  public readonly mode: Signal<ChangeableEntityMode>;

  protected constructor(
    dto: Partial<TDto>,
    validationRules: ValidationRule<Partial<TDto>>[],
    mode: ChangeableEntityMode = "create"
  )
  {
    super(dto, validationRules);
    this.mode = signal(mode);
  }

  static create<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
    this: new(dto: Partial<TDto>, mode: ChangeableEntityMode) => TEntity,
    dto: Partial<TDto>
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
}
