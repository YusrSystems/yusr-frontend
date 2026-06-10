import { Signal, signal } from "@preact/signals-react";
import type { ValidationRule } from "../validation";
import type { Dto } from "./dto";
import { ValidatableEntity } from "./validatableEntity";

export type ChangeableEntityMode = "create" | "update";

export abstract class ChangeableEntity<TDto extends Dto> extends ValidatableEntity<TDto>
{
  public readonly mode: Signal<ChangeableEntityMode>;
  protected abstract initialValue(dto?: Partial<TDto>): TDto;

  protected constructor(
    dto: TDto,
    validationRules: ValidationRule<Partial<TDto>>[],
    mode: ChangeableEntityMode = "create"
  )
  {
    super(dto, validationRules);
    this.mode = signal(mode);
  }

  static create<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
    this: new(dto: TDto, mode: ChangeableEntityMode) => TEntity,
    dto?: Partial<TDto>
  ): TEntity
  {
    return new this(this.prototype.initialValue(dto), "create");
  }

  static load<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
    this: new(dto: TDto, mode: ChangeableEntityMode) => TEntity,
    dto: TDto
  ): TEntity
  {
    return new this(dto, "update");
  }
}
