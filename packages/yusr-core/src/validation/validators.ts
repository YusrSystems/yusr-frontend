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

  static optional(...validators: ValidatorFn<string>[]): ValidatorFn<string>
  {
    return (value, formData) =>
    {
      if (value === null || value === undefined || value === "")
      {
        return null;
      }
      for (const validator of validators)
      {
        const error = validator(value, formData);
        if (error)
        {
          return error;
        }
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
        return message || `القيمة يجب أن تكون أكبر من ${min}`;
      }
      return null;
    };
  }

  static max(max: number, message?: string): ValidatorFn
  {
    return (value) =>
    {
      if (isNaN(value) || value > max)
      {
        return message || `القيمة يجب أن تكون أصغر من ${max}`;
      }
      return null;
    };
  }

  static minLength(min: number, message?: string): ValidatorFn<string>
  {
    return (value) =>
    {
      if (value.length < min)
      {
        return message || `يجب أن طول النص أكبر من ${min}`;
      }
      return null;
    };
  }

  static maxLength(max: number, message?: string): ValidatorFn<string>
  {
    return (value) =>
    {
      if (value.length > max)
      {
        return message || `يجب أن طول النص أقل من ${max}`;
      }
      return null;
    };
  }

  static exactLength(length: number, message?: string): ValidatorFn<string>
  {
    return (value) =>
    {
      if (value.length !== length)
      {
        return message || `يجب أن يكون طول النص ${length} خانات`;
      }
      return null;
    };
  }

  static numeric(message?: string): ValidatorFn<string>
  {
    return (value) =>
    {
      if (!/^\d+$/.test(value))
      {
        return message || `يجب أن يحتوي الحقل على أرقام فقط`;
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
