import type { Signal } from "@preact/signals-react";
import type { i18n, TFunction } from "i18next";
import { createContext, useContext } from "react";


export type SearchableSelectContextType<TDto = any> = {
	isOpen: Signal<boolean>;
	i18n: i18n;
	t: TFunction<"common">;
	searchInput: Signal<string | undefined>;
	ids?: Signal<number[]>;
	labels?: Signal<Record<number, string>>;
	selectedItems?: Signal<TDto[]>;
	labelSelector?: keyof TDto;
	onToggle?: (ids: number[], selectedItems: TDto[]) => void;
};

export const SearchableSelectContext = createContext<
	SearchableSelectContextType<any> | undefined
>(undefined);

export default function useSearchableSelectContext<TDto = any>()
{
	const context = useContext(SearchableSelectContext);
	if (context === undefined)
	{
		throw new Error(
			"useSearchableSelectContext must be used within a SearchableSelectProvider"
		);
	}
	return context as SearchableSelectContextType<TDto>;
}