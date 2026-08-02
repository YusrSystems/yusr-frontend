import type { Signal } from "@preact/signals-react";
import type { i18n, TFunction } from "i18next";
import { createContext, useContext } from "react";

export type SearchableSelectContextType = {
  isOpen: Signal<boolean>;
  i18n: i18n;
  t: TFunction<"common">;
  searchInput: Signal<string | undefined>;
};

export const SearchableSelectContext = createContext<SearchableSelectContextType | undefined>(undefined);

export default function useSearchableSelectContext()
{
  const context = useContext(SearchableSelectContext);
  if (context == undefined)
  {
    throw new Error("useSearchableSelectContext must be used within a SearchableSelectProvider");
  }
  return context;
}
