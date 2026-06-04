import { type Signal, signal } from "@preact/signals-react";
import type { ValidationRule } from "../validation";
import type { Dto } from "./dto";
import { Entity } from "./entity";

export abstract class ValidatableEntity<TDto extends Dto> extends Entity<TDto>
{
  ignoreWarnings: Signal<boolean> = signal(false);
  readonly errors: Record<keyof TDto, Signal<string | undefined>> = {} as Record<
    keyof TDto,
    Signal<string | undefined>
  >;
  private _validationRules: ValidationRule<Partial<TDto>>[] = [];

  constructor(dto: Partial<TDto>, validationRules: ValidationRule<Partial<TDto>>[])
  {
    super(dto);
    this._validationRules = validationRules;
    this._validationRules.forEach((rule) =>
    {
      const field = rule.field;
      this.errors[field] = signal(undefined);
    });
  }

  validate(dto?: Partial<TDto>): boolean
  {
    const target = dto ?? this.toJson();
    this._validationRules.forEach((rule) =>
    {
      const value = rule.selector(target);
      for (const validator of rule.validators)
      {
        const error = validator(value, target);

        if (error)
        {
          console.log(error);
          this.errors[rule.field].value = error;
          break;
        }
      }
    });

    return Object.values(this.errors).every(
      (s) => (s as Signal<string | undefined>).value === undefined
    );
  }

  getError = (field: keyof TDto) => this.errors[field];

  clearError(field: keyof TDto)
  {
    this.errors[field].value = undefined;
  }
}
