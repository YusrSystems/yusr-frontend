import { useCallback } from "react";

export function useDynamicList<T, K extends keyof T>(
  fieldName: K,
  setFormData: (updater: (prev: T) => T) => void,
  clearError: (field: string) => void
)
{
  const addRow = useCallback((newItem: any) =>
  {
    setFormData((prev: any) => ({ ...prev, [fieldName]: [...(prev[fieldName] || []), newItem] }));
    clearError(fieldName as string);
  }, [fieldName, setFormData, clearError]);

  const removeRow = useCallback((index: number, reindexField?: string) =>
  {
    setFormData((prev: any) =>
    {
      const list = (prev[fieldName] || []).filter((_: any, i: number) => i !== index);
      // Optional: fix indices (like station.index)
      const updatedList = reindexField
        ? list.map((item: any, i: number) => ({ ...item, [reindexField]: i + 1 }))
        : list;

      return { ...prev, [fieldName]: updatedList };
    });
    clearError(fieldName as string);
  }, [fieldName, setFormData, clearError]);

  const updateRow = useCallback((index: number, subField: string, value: any) =>
  {
    setFormData((prev: any) =>
    {
      const list = [...(prev[fieldName] || [])];
      list[index] = { ...list[index], [subField]: value };
      return { ...prev, [fieldName]: list };
    });
    clearError(subField); // Clear specific field error
  }, [fieldName, setFormData, clearError]);

  return { addRow, removeRow, updateRow };
}
