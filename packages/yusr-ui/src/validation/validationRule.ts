import type { ValidatorFn } from "./validatorFn";

export interface ValidationRule<T>
{
  field: keyof T | string;
  selector: (data: T) => any;
  validators: ValidatorFn[];
}