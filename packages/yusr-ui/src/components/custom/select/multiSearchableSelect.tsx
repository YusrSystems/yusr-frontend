import { Dto } from "../../../stateManager";
import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { type PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useSearchableSelectContext, { SearchableSelectContext } from "./useSearchableSelectContext";
import {
	Badge,
	Button,
	Command,
	CommandEmpty,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "../../pure";
import { cn } from "../../../utils/cn.ts";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { SearchInput, type SearchInputParams } from "../../custom";


export type MultiSearchableSelectOptionProps<TDto extends Dto> = {
	ids: Signal<number[]>;
	labels?: Signal<Record<number, string>>;
	labelSelector: keyof TDto;
	item: TDto;
	disabled?: boolean;
	onToggle?: (ids: number[]) => void;
};

export type MultiSearchableSelectProps<TDto extends Dto> = Omit<
	MultiSearchableSelectOptionProps<TDto>,
	"labelSelector" | "item"
>;

export function MultiSearchableSelect<TDto extends Dto>({children}: PropsWithChildren)
{
	useSignals();
	const isOpen = useMemo(() => signal<boolean>(false), []);
	const searchInput = useMemo(() => signal<string | undefined>(""), []);
	const {t, i18n} = useTranslation("common");

	return (
		<SearchableSelectContext.Provider
			value={ {
				isOpen: isOpen,
				i18n: i18n,
				t: t,
				searchInput: searchInput
			} }
		>
			<Popover open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open } modal={ true }>
				{ children }
			</Popover>
		</SearchableSelectContext.Provider>
	);
}

// Trigger shows badges for selected items (or a count once it gets crowded) instead of a single label
MultiSearchableSelect.Trigger = function (
	{className, labels, placeholder, ...props}: React.ComponentProps<"button"> & {
		labels?: Signal<Record<number, string>>;
		placeholder?: string;
	}
)
{
	useSignals();
	const data = useSearchableSelectContext();
	const labelMap = labels?.value ?? {};
	const selectedLabels = Object.values(labelMap);

	return (
		<PopoverTrigger asChild>
			<Button
				dir={ data.i18n.dir() }
				variant="outline"
				role="combobox"
				aria-expanded={ data.isOpen.value }
				className={ cn(
					"w-full justify-between font-normal",
					className
				) }
				{ ...props }
			>
				<div className="flex flex-wrap gap-1 flex-1 justify-start">
					{ selectedLabels.length === 0 && (
						<span className="text-muted-foreground truncate">
							{ placeholder || data.t("searchableSelect.placeholder") }
						</span>
					) }
					{ selectedLabels.length > 0 && selectedLabels.length <= 3 && selectedLabels.map((label, i) => (
						<Badge key={ i } variant="secondary" className="font-normal">
							{ label }
						</Badge>
					)) }
					{ selectedLabels.length > 3 && (
						<Badge variant="secondary" className="font-normal">
							{ data.t("searchableSelect.selectedCount", {count: selectedLabels.length}) }
						</Badge>
					) }
				</div>
				<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ltr:ml-2 rtl:mr-2"/>
			</Button>
		</PopoverTrigger>
	);
};

MultiSearchableSelect.Content = function ({children}: React.PropsWithChildren)
{
	const data = useSearchableSelectContext();
	return (
		<PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" dir={ data.i18n.dir() }>
			{ children }
		</PopoverContent>
	);
};

MultiSearchableSelect.SearchInput = function ({...props}: SearchInputParams)
{
	const data = useSearchableSelectContext();
	return (
		<SearchInput
			{ ...props }
			onSearch={ (searchText) =>
			{
				data.searchInput.value = searchText;
				props.onSearch?.(searchText);
			} }
		/>
	);
};

MultiSearchableSelect.Command = function ({children}: React.PropsWithChildren)
{
	return (
		<Command shouldFilter={ false }>
			<CommandList className="max-h-50 overflow-y-auto overflow-x-hidden">
				{ children }
			</CommandList>
		</Command>
	);
};

MultiSearchableSelect.Loading = function ()
{
	const data = useSearchableSelectContext();
	return (
		<div className="flex items-center justify-center py-6 text-muted-foreground">
			<Loader2 className="ml-2 h-4 w-4 animate-spin"/>
			<span className="text-sm">{ data.t("searchableSelect.loading") }</span>
		</div>
	);
};

MultiSearchableSelect.Empty = function ()
{
	const data = useSearchableSelectContext();
	return (
		<CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
			{ data.t("searchableSelect.noData") }
		</CommandEmpty>
	);
};

MultiSearchableSelect.OptionBody = function ({label}: { label: string; })
{
	return <span className="flex-1 truncate">{ label }</span>;
};

// Toggles membership in `ids` instead of replacing the value; popover stays open after selection
MultiSearchableSelect.Option = function <TDto extends Dto>(
	{
		ids,
		labels,
		labelSelector,
		item,
		disabled,
		onToggle,
		children
	}: MultiSearchableSelectOptionProps<TDto> & PropsWithChildren
)
{
	useSignals();
	const itemId = item.id;
	const isSelected = ids.value.includes(itemId);

	return (
		<CommandItem
			value={ itemId.toString() }
			disabled={ disabled }
			onSelect={ () =>
			{
				const nextSelected = !isSelected;

				ids.value = nextSelected
					? [...ids.value, itemId]
					: ids.value.filter((id) => id !== itemId);

				if (labels)
				{
					const nextLabels = {...labels.value};
					if (nextSelected)
					{
						nextLabels[itemId] = (item[labelSelector] as Signal<string>).value;
					}
					else
					{
						delete nextLabels[itemId];
					}
					labels.value = nextLabels;
				}

				onToggle?.(ids.value);
			} }
			className="cursor-pointer group"
		>
			<Check
				className={ cn(
					"h-4 w-4 ltr:mr-2 rtl:ml-2 shrink-0",
					isSelected ? "opacity-100" : "opacity-0"
				) }
			/>
			{ children }
		</CommandItem>
	);
};

// Optional footer showing a clear-all action once something is selected
MultiSearchableSelect.Footer = function (
	{ids, labels}: { ids: Signal<number[]>; labels?: Signal<Record<number, string>>; }
)
{
	useSignals();
	const data = useSearchableSelectContext();

	if (ids.value.length === 0)
	{
		return null;
	}

	return (
		<div className="flex items-center justify-between border-t px-3 py-2">
		<span className="text-xs text-muted-foreground">
			{ data.t("searchableSelect.selectedCount", {count: ids.value.length}) }
			</span>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="h-6 px-2 text-xs"
				onClick={ () =>
				{
					ids.value = [];
					if (labels)
					{
						labels.value = {};
					}
				} }
			>
				<X className="h-3 w-3 ltr:mr-1 rtl:ml-1"/>
				{ data.t("searchableSelect.clearAll") }
			</Button>
		</div>
	);
};