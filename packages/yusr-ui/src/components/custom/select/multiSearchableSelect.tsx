import { Dto } from "#/stateManager";
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
import { cn } from "#/utils/cn.ts";
import { Check, ChevronsUpDown, Loader2, Pencil, Trash2, X } from "lucide-react";
import { SearchInput, type SearchInputParams } from "../../custom";


export type MultiSearchableSelectRootProps<TDto extends Dto> = PropsWithChildren<{
	ids?: Signal<number[]>;
	labels?: Signal<Record<number, string>>;
	selectedItems?: Signal<TDto[]>;
	labelSelector?: keyof TDto;
	disabled?: boolean;
	onToggle?: (ids: number[], selectedItems: TDto[]) => void;
}>;

export type MultiSearchableSelectOptionProps<TDto extends Dto> = {
	item: TDto;
	ids?: Signal<number[]>;
	labels?: Signal<Record<number, string>>;
	labelSelector?: keyof TDto;
	selectedItems?: Signal<TDto[]>;
	disabled?: boolean;
	onToggle?: (ids: number[], selectedItems: TDto[]) => void;
};

export function MultiSearchableSelect<TDto extends Dto>({
	ids: propIds,
	labels: propLabels,
	selectedItems,
	labelSelector,
	onToggle,
	children
}: MultiSearchableSelectRootProps<TDto>)
{
	useSignals();
	const isOpen = useMemo(() => signal<boolean>(false), []);
	const searchInput = useMemo(() => signal<string | undefined>(""), []);
	const {t, i18n} = useTranslation("common");

	// Initialize IDs from selectedItems if not explicitly provided
	const localIds = useMemo(
		() => propIds ?? signal<number[]>(selectedItems?.value?.map((i) => i.id) ?? []),
		[propIds, selectedItems]
	);

	// Initialize Labels from selectedItems if not explicitly provided
	const localLabels = useMemo(
		() => propLabels ?? signal<Record<number, string>>(
			selectedItems?.value?.reduce((acc, item) =>
			{
				if (labelSelector) acc[item.id] = item[labelSelector] as string;
				return acc;
			}, {} as Record<number, string>) ?? {}
		),
		[propLabels, selectedItems, labelSelector]
	);

	return (
		<SearchableSelectContext.Provider
			value={ {
				isOpen,
				i18n,
				t,
				searchInput,
				ids: localIds,
				labels: localLabels,
				selectedItems,
				labelSelector,
				onToggle
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
	{className, labels: propLabels, placeholder, ...props}: React.ComponentProps<"button"> & {
		labels?: Signal<Record<number, string>>;
		placeholder?: string;
	}
)
{
	useSignals();
	const data = useSearchableSelectContext();
	const labels = propLabels ?? data.labels;
	const labelMap = labels?.value ?? {};
	const selectedLabels = Object.values(labelMap);

	return (
		<PopoverTrigger asChild>
			<Button
				dir={ data.i18n.dir() }
				variant="outline"
				role="combobox"
				aria-expanded={ data.isOpen.value }
				className={ cn("w-full justify-between font-normal", className) }
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
	props: MultiSearchableSelectOptionProps<TDto> & PropsWithChildren
)
{
	useSignals();
	const context = useSearchableSelectContext();

	const ids = props.ids ?? context.ids ?? signal<number[]>([]);
	const labels = props.labels ?? context.labels;
	const selectedItems = props.selectedItems ?? context.selectedItems;
	const labelSelector = props.labelSelector ?? context.labelSelector;
	const onToggle = props.onToggle ?? context.onToggle;
	const {item, disabled, children} = props;

	const itemId = item.id;
	const isSelected = ids.value.includes(itemId);

	return (
		<CommandItem
			value={ itemId.toString() }
			disabled={ disabled }
			onSelect={ () =>
			{
				const nextSelected = !isSelected;

				const nextIds = nextSelected
					? [...ids.value, itemId]
					: ids.value.filter((id) => id !== itemId);
				ids.value = nextIds;

				if (labels && labelSelector)
				{
					const nextLabels = {...labels.value};
					if (nextSelected)
					{
						nextLabels[itemId] = String(item[labelSelector as keyof TDto]);
					}
					else
					{
						delete nextLabels[itemId];
					}
					labels.value = nextLabels;
				}

				if (selectedItems)
				{
					const nextItems = nextSelected
						? [...selectedItems.value, item]
						: selectedItems.value.filter((i) => i.id !== itemId);

					selectedItems.value = nextItems;
					onToggle?.(nextIds, nextItems);
				}
				else
				{
					onToggle?.(nextIds, [item]);
				}
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

MultiSearchableSelect.DeleteOptionButton = function ({onDelete}: { onDelete: () => Promise<void>; })
{
	useSignals();
	const isDeleting = useMemo(() => signal(false), []);

	return (
		<div
			className="flex items-center justify-center min-w-[32px]"
			onClick={ (e) => e.stopPropagation() }
			onPointerDown={ (e) => e.stopPropagation() }
			onPointerUp={ (e) => e.stopPropagation() }
		>
			{ isDeleting.value
				? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>
				: (
					<Button
						type="button"
						onClick={ async (e) =>
						{
							e.preventDefault();
							e.stopPropagation();
							isDeleting.value = true;
							await onDelete();
							isDeleting.value = false;
						} }
						variant="destructive"
						size="sm"
						className="shrink-0 rounded-lg px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<Trash2 className="h-3.5 w-3.5"/>
					</Button>
				) }
		</div>
	);
};

MultiSearchableSelect.EditOptionButton = function ({onEdit}: { onEdit: () => void; })
{
	return (
		<div
			className="flex items-center justify-center min-w-[32px]"
			onClick={ (e) => e.stopPropagation() }
			onPointerDown={ (e) => e.stopPropagation() }
			onPointerUp={ (e) => e.stopPropagation() }
		>
			<Button
				type="button"
				onClick={ (e) =>
				{
					e.preventDefault();
					e.stopPropagation();
					onEdit();
				} }
				variant="outline"
				size="sm"
				className="shrink-0 rounded-lg px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
				aria-label="edit"
			>
				<Pencil className="h-3.5 w-3.5"/>
			</Button>
		</div>
	);
};

MultiSearchableSelect.AddOptionButton = function (
	{onCreate}: { onCreate: (searchText: string | undefined, closeCommand: () => void) => Promise<void>; }
)
{
	useSignals();
	const isAdding = useMemo(() => signal(false), []);
	const data = useSearchableSelectContext();

	if (!data.searchInput.value)
	{
		return null;
	}

	return (
		<CommandItem
			value={ `__create__${ data.searchInput.value }` }
			onSelect={ async () =>
			{
				isAdding.value = true;
				await onCreate(data.searchInput.value, () =>
				{
					data.isOpen.value = false;
					data.searchInput.value = undefined;
				});
				isAdding.value = false;
			} }
			className="cursor-pointer text-primary"
		>
			{ isAdding.value
				? <Loader2 className="h-4 w-4 animate-spin"/>
				: (
					<>
						<span className="ltr:mr-2 rtl:ml-2">+</span>
						{ data.t("searchableSelect.addOption", {value: data.searchInput.value?.trim()}) }
					</>
				) }
		</CommandItem>
	);
};

// Optional footer showing a clear-all action once something is selected
MultiSearchableSelect.Footer = function (
	{ids: propIds, labels: propLabels}: { ids?: Signal<number[]>; labels?: Signal<Record<number, string>>; } = {}
)
{
	useSignals();
	const data = useSearchableSelectContext();
	const ids = propIds ?? data.ids;
	const labels = propLabels ?? data.labels;

	if (ids?.value.length === 0)
	{
		return null;
	}

	return (
		<div className="flex items-center justify-between border-t px-3 py-2">
			<span className="text-xs text-muted-foreground">
				{ data.t("searchableSelect.selectedCount", {count: ids?.value.length}) }
			</span>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="h-6 px-2 text-xs"
				onClick={ () =>
				{
					if (ids) ids.value = [];
					if (labels) labels.value = {};
					if (data.selectedItems) data.selectedItems.value = [];
					data.onToggle?.([], []);
				} }
			>
				<X className="h-3 w-3 ltr:mr-1 rtl:ml-1"/>
				{ data.t("searchableSelect.clearAll") }
			</Button>
		</div>
	);
};