import type { ValidatorFn } from "./validatorFn";

export interface ValidationRuleOld<T>
{
  field: keyof T | string;
  selector: (data: T) => any;
  validators: ValidatorFn[];
}

export interface ValidationRule<T>
{
  field: keyof T;
  selector: (data: T) => any;
  validators: ValidatorFn[];
}
