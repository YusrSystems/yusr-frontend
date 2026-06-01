import { type Signal, signal } from "@preact/signals-react";
import type { ValidationRule } from "../validation";
import type { Dto } from "./dto";
import { Entity } from "./entity";

export abstract class ValidatableEntity<TDto extends Dto> extends Entity<TDto>
{
  readonly errors: Record<keyof TDto, Signal<string | undefined>>;
  abstract ValidationRules(): ValidationRule<Partial<TDto>>[];

  constructor(data: Partial<TDto>)
  {
    super(data);
    this.errors = {} as Record<keyof TDto, Signal<string | undefined>>;
    this.ValidationRules().forEach((rule) =>
    {
      const field = rule.field;
      this.errors[field] = signal(undefined);
    });
  }

  validate(data: Partial<TDto>): boolean
  {
    this.ValidationRules().forEach((rule) =>
    {
      const value = rule.selector(data);
      for (const validator of rule.validators)
      {
        const error = validator(value, data);
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
