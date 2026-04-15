import type { ValidatorFn } from "./validatorFn";

export class Validators
{
  static required(message = "هذا الحقل مطلوب"): ValidatorFn
  {
    return (value) =>
    {
      if (value === null || value === undefined || value === "")
      {
        return message;
      }
      if (typeof value === "string" && value.trim() === "")
      {
        return message;
      }
      return null;
    };
  }

  static min(min: number, message?: string): ValidatorFn
  {
    return (value) =>
    {
      if (isNaN(value) || value < min)
      {
        return message || `القيمة يجب أن تكون أكبر من أو تساوي ${min}`;
      }
      return null;
    };
  }

  static max(threshold: number, message?: string): ValidatorFn
  {
    return (value) =>
    {
      if (isNaN(value) || value <= threshold)
      {
        return message || `القيمة يجب أن تكون أكبر من ${threshold}`;
      }
      return null;
    };
  }

  static arrayMinLength(min: number, message?: string): ValidatorFn
  {
    return (value: any[]) =>
    {
      if (!Array.isArray(value) || value.length < min)
      {
        return message || `يجب اختيار عنصر واحد على الأقل`;
      }
      return null;
    };
  }

  static custom<T>(fn: (value: T, formData: any) => boolean, message: string): ValidatorFn<T>
  {
    return (value, formData) =>
    {
      return !fn(value, formData) ? message : null;
    };
  }
}
