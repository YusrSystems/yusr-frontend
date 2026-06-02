import { type Signal, signal } from "@preact/signals-react";
import type { ValidationRule } from "../validation";
import type { Dto } from "./dto";
import { Entity } from "./entity";

export abstract class ValidatableEntity<TDto extends Dto> extends Entity<TDto>
{
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

  validate(dto: Partial<TDto>): boolean
  {
    this._validationRules.forEach((rule) =>
    {
      const value = rule.selector(dto);
      for (const validator of rule.validators)
      {
        const error = validator(value, dto);
        if (error)
        {
          this.errors[rule.field].value = error;
          break;
        }
      }
    });

    return Object.keys(this.errors).length === 0;
  }
}
