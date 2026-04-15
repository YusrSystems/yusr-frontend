import { useCallback, useState } from "react";
import type { ValidationRule } from "@yusr_systems/core";

export function useFormValidation<T>(data: T, rules: ValidationRule<T>[])
{
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getError = (field: keyof T | string) => errors[field as string];

  const isInvalid = (field: keyof T | string) => !!errors[field as string];

  const validate = useCallback((): boolean =>
  {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    rules.forEach((rule) =>
    {
      const value = rule.selector(data);

      for (const validator of rule.validators)
      {
        const error = validator(value, data);
        if (error)
        {
          newErrors[rule.field as string] = error;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, rules]);

  const clearError = (field: keyof T | string) =>
  {
    setErrors((prev) =>
    {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  };

  const errorInputClass = (field: string) =>
    isInvalid(field) ? "border-red-600 dark:border-red-600 ring-red-600 text-red-600 placeholder:text-red-600" : "";

  return { errors, getError, isInvalid, validate, clearError, errorInputClass };
}
