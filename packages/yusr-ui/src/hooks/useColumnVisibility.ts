import { useState } from "react";

export function useColumnVisibility(storageKey: string, keys: string[])
{
  const defaultVisible = Object.fromEntries(keys.map((k) => [k, true]));

  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
  {
    try
    {
      const stored = localStorage.getItem(storageKey);
      return stored ? { ...defaultVisible, ...JSON.parse(stored) } : defaultVisible;
    }
    catch
    {
      return defaultVisible;
    }
  });

  const toggle = (key: string) =>
  {
    setVisible((prev) =>
    {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const isVisible = (key: string) => visible[key] ?? true;

  return { visible, toggle, isVisible };
}
