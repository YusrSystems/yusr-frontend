import { useCallback, useState } from "react";
import type { ValidationRule } from "yusr-core";
import { useFormValidation } from "./useFormValidation";

export function useEntityForm<T>(initialData: Partial<T> | undefined, rules: ValidationRule<Partial<T>>[])
{
  const [formData, setFormData] = useState<Partial<T>>({ ...initialData });
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (initialData !== prevInitialData)
  {
    setFormData({ ...initialData });
    setPrevInitialData(initialData);
  }

  const validation = useFormValidation(formData, rules);

  const handleChange = useCallback((update: Partial<T> | ((prev: Partial<T>) => Partial<T>)) =>
  {
    setFormData((prev) =>
    {
      const updates = typeof update === "function" ? update(prev) : update;

      Object.keys(updates).forEach((key) =>
      {
        validation.clearError(key as string);
      });

      return { ...prev, ...updates };
    });
  }, [validation]);

  return { formData, handleChange, ...validation };
}
