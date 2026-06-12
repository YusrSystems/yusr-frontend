import { Signal, signal } from "@preact/signals-react";
import type { ValidationRule } from "../validation";
import type { Dto } from "./dto";
import { ValidatableEntity } from "./validatableEntity";

export type ChangeableEntityMode = "create" | "update";

export abstract class ChangeableEntity<TDto extends Dto> extends ValidatableEntity<TDto>
{
  public readonly mode: Signal<ChangeableEntityMode>;
  public readonly isDirty: Signal<boolean> = signal(false);

  private originalDto: TDto;
  private modifiedFields: Set<string> = new Set();
  readonly hasChanges: Signal<boolean> = signal(false);

  protected abstract initialValue(dto?: Partial<TDto>): TDto;

  protected constructor(
    dto: TDto,
    validationRules: ValidationRule<Partial<TDto>>[],
    mode: ChangeableEntityMode = "create"
  )
  {
    super(dto, validationRules);
    this.mode = signal(mode);
    this.originalDto = dto;
  }

  static create<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
    this: new(dto: TDto, mode: ChangeableEntityMode) => TEntity,
    dto?: Partial<TDto>
  ): TEntity
  {
    const value = new this(this.prototype.initialValue(dto), "create");
    value.initChanged();
    value.resetDirty();
    return value;
  }

  static load<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
    this: new(dto: TDto, mode: ChangeableEntityMode) => TEntity,
    dto: TDto
  ): TEntity
  {
    return new this(dto, "update");
  }

  protected normalizeForComparison(value: any): any
  {
    if (value === null || value === undefined)
    {
      return "";
    }

    if (typeof value === "string")
    {
      return value.trim();
    }

    return value;
  }

  protected onFieldChange(field: keyof TDto, newValue: any): void
  {
    super.onFieldChange(field, newValue);
    this.isDirty.value = true;

    const originalValue = this.originalDto[field];
    const normOriginal = this.normalizeForComparison(originalValue);
    const normNew = this.normalizeForComparison(newValue);
    console.log(JSON.stringify(normOriginal), JSON.stringify(normNew));
    const isDifferent = JSON.stringify(normOriginal) !== JSON.stringify(normNew);

    if (isDifferent)
    {
      this.modifiedFields.add(field as string);
    }
    else
    {
      this.modifiedFields.delete(field as string);
    }

    this.hasChanges.value = this.modifiedFields.size > 0;
  }

  resetDirty()
  {
    this.isDirty.value = false;
  }

  private initChanged()
  {
    this.hasChanges.value = true;
    this.modifiedFields.clear();
    this.originalDto = {} as TDto;
  }

  resetChanged()
  {
    this.hasChanges.value = false;
    this.modifiedFields.clear();
    this.originalDto = JSON.parse(JSON.stringify(this.toJson()));
  }
}
