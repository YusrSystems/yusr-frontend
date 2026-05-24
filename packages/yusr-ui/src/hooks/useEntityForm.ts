import { useCallback, useRef, useState } from "react";
import type { ValidationRule } from "../validation";
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

  // Keep clearError stable via ref — always points to latest version
  const clearErrorRef = useRef(validation.clearError);
  clearErrorRef.current = validation.clearError;

  const handleChange = useCallback(
    (update: Partial<T> | ((prev: Partial<T>) => Partial<T>)) =>
    {
      setFormData((prev) =>
      {
        const updates = typeof update === "function" ? update(prev) : update;
        return { ...prev, ...updates };
      });

      const updates = typeof update === "function" ? update({} as Partial<T>) : update;
      Object.keys(updates).forEach((key) =>
      {
        clearErrorRef.current(key as string); // stable ref, no dependency needed
      });
    },
    [] // no dependencies — handleChange never changes
  );

  return { formData, handleChange, ...validation };
}