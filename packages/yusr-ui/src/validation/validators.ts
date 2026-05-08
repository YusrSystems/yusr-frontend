import { type TFunction } from "i18next";
import type { ValidatorFn } from "./validatorFn";

export class Validators
{
  private static t: TFunction<"common"> | null = null;

  public static init(t: TFunction<"common">)
  {
    this.t = t;
  }

  private static getT(): TFunction<"common">
  {
    if (!this.t)
    {
      // Return a fallback TFunction that returns default messages
      return this.getFallbackT();
    }
    return this.t;
  }

  private static getFallbackT(): TFunction<"common">
  {
    const fallbackMessages: Record<string, string> = {
      "validators.required": "هذا الحقل مطلوب",
      "validators.min": "القيمة يجب أن تكون أكبر من {{min}}",
      "validators.max": "القيمة يجب أن تكون أصغر من {{max}}",
      "validators.minLength": "يجب أن طول النص أكبر من {{min}}",
      "validators.maxLength": "يجب أن طول النص أقل من {{max}}",
      "validators.exactLength": "يجب أن يكون طول النص {{length}} خانات",
      "validators.numeric": "يجب أن يحتوي الحقل على أرقام فقط",
      "validators.arrayMinLength": "يجب اختيار عنصر واحد على الأقل"
    };

    const fallbackT = ((key: string, options?: { [key: string]: any }) =>
    {
      let message = fallbackMessages[key] || key;
      if (options)
      {
        Object.entries(options).forEach(([k, v]) =>
        {
          message = message.replace(`{{${k}}}`, v);
        });
      }
      return message;
    }) as TFunction<"common">;

    return fallbackT;
  }

  static required(message?: string): ValidatorFn
  {
    const t = this.getT();
    const defaultMessage = message || t("validators.required");
    return (value) =>
    {
      if (value === null || value === undefined || value === "")
      {
        return defaultMessage;
      }
      if (typeof value === "string" && value.trim() === "")
      {
        return defaultMessage;
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
    const t = this.getT();
    const defaultMessage = message || t("validators.min", { min });
    return (value) =>
    {
      if (isNaN(value) || value < min)
      {
        return defaultMessage;
      }
      return null;
    };
  }

  static max(max: number, message?: string): ValidatorFn
  {
    const t = this.getT();
    const defaultMessage = message || t("validators.max", { max });
    return (value) =>
    {
      if (isNaN(value) || value > max)
      {
        return defaultMessage;
      }
      return null;
    };
  }

  static minLength(min: number, message?: string): ValidatorFn<string>
  {
    const t = this.getT();
    const defaultMessage = message || t("validators.minLength", { min });
    return (value) =>
    {
      if (value.length < min)
      {
        return defaultMessage;
      }
      return null;
    };
  }

  static maxLength(max: number, message?: string): ValidatorFn<string>
  {
    const t = this.getT();
    const defaultMessage = message || t("validators.maxLength", { max });
    return (value) =>
    {
      if (value.length > max)
      {
        return defaultMessage;
      }
      return null;
    };
  }

  static exactLength(length: number, message?: string): ValidatorFn<string>
  {
    const t = this.getT();
    const defaultMessage = message || t("validators.exactLength", { length });
    return (value) =>
    {
      if (value.length !== length)
      {
        return defaultMessage;
      }
      return null;
    };
  }

  static numeric(message?: string): ValidatorFn<string>
  {
    const t = this.getT();
    const defaultMessage = message || t("validators.numeric");
    return (value) =>
    {
      if (!/^\d+$/.test(value))
      {
        return defaultMessage;
      }
      return null;
    };
  }

  static arrayMinLength(min: number, message?: string): ValidatorFn
  {
    const t = this.getT();
    const defaultMessage = message || t("validators.arrayMinLength", { min });
    return (value: any[]) =>
    {
      if (!Array.isArray(value) || value.length < min)
      {
        return defaultMessage;
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