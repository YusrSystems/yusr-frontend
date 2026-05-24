import { useCallback } from "react";
import type { ValidationRule } from "../validation";

export function useValidate<T>(
  data: Partial<T>,
  validationRules: ValidationRule<Partial<T>>[],
  onSetErrors: (errors: Record<string, string>) => void
)
{
  const validate = useCallback((): boolean =>
  {
    const newErrors: Record<string, string> = {};

    validationRules.forEach((rule) =>
    {
      const value = rule.selector(data);
      for (const validator of rule.validators)
      {
        const error = validator(value, data);
        console.log(
          "=================================",
          "Validating field:",
          rule.field,
          "with value:",
          value,
          "and error:",
          error,
          "================================="
        );
        if (error)
        {
          newErrors[rule.field as string] = error;
          break;
        }
      }
    });

    onSetErrors(newErrors);
    return Object.keys(newErrors).length === 0;

    // validationRules must be a stable reference (static or memoized)
  }, [data, validationRules, onSetErrors]);

  return { validate };
}
