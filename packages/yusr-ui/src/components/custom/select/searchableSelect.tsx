import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Check, ChevronsUpDown, Loader2, Pencil, Trash2, X } from "lucide-react";
import * as React from "react";
import { type PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Dto } from "#/stateManager";
import { cn } from "#/utils/cn.ts";
import { Button } from "../../pure/button";
import {
	Command,
	CommandEmpty,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "#/components/pure";
import { SearchInput, type SearchInputParams, TextField } from "#/components/custom";
import useSearchableSelectContext, { SearchableSelectContext } from "./useSearchableSelectContext";


export type SearchableSelectOptionProps<TDto extends Dto> = {
	id?: Signal<number | undefined>;
	label?: Signal<string | undefined>;
	labelSelector: keyof TDto;
	item: TDto;
	disabled?: boolean;
	onSelect?: (item?: TDto) => void;
};

export type SearchableSelectProps<TDto extends Dto> = Omit<
	SearchableSelectOptionProps<TDto>,
	"labelSelector" | "item"
>;

export function SearchableSelect<TDto extends Dto>({children}: PropsWithChildren)
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

SearchableSelect.Trigger = function (
	{className, label, placeholder, ...props}: React.ComponentProps<"button"> & {
		label?: Signal<string | undefined>;
		placeholder?: string
	}
)
{
	useSignals();
	const data = useSearchableSelectContext();
	const resolvedLabel = label instanceof Signal ? label.value : label;

	return (
		<PopoverTrigger asChild>
			<Button
				dir={ data.i18n.dir() }
				variant="outline"
				role="combobox"
				aria-expanded={ data.isOpen.value }

				className={ cn(
					"w-full justify-between px-3 font-normal",
					className
				) }
				{ ...props }
			>
				<span
					className="truncate text-start">{ resolvedLabel || (placeholder ?? data.t("searchableSelect.placeholder")) }</span>
				<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ltr:ml-2 rtl:mr-2"/>
			</Button>
		</PopoverTrigger>
	);
};

SearchableSelect.Content = function ({children}: React.PropsWithChildren)
{
	const data = useSearchableSelectContext();
	return (
		<PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" dir={ data.i18n.dir() }>
			{ children }
		</PopoverContent>
	);
};

SearchableSelect.SearchInput = function ({...props}: SearchInputParams)
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

SearchableSelect.Command = function ({children}: React.PropsWithChildren)
{
	return (
		<Command shouldFilter={ false }>
			<CommandList className="max-h-50 overflow-y-auto overflow-x-hidden">
				{ children }
			</CommandList>
		</Command>
	);
};

SearchableSelect.Loading = function ()
{
	const data = useSearchableSelectContext();
	return (
		<div className="flex items-center justify-center py-6 text-muted-foreground">
			<Loader2 className="ml-2 h-4 w-4 animate-spin"/>
			<span className="text-sm">{ data.t("searchableSelect.loading") }</span>
		</div>
	);
};

SearchableSelect.Empty = function ()
{
	const data = useSearchableSelectContext();
	return (
		<CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
			{ data.t("searchableSelect.noData") }
		</CommandEmpty>
	);
};

SearchableSelect.OptionBody = function ({label}: { label: string; })
{
	return <span className="flex-1 truncate">{ label }</span>;
};

/**
 * Drop-in replacement for `OptionBody` that adds a hover-revealed pencil icon.
 * Clicking it turns the row into an inline text input so the user can rename
 * the entity in place, without closing the popover or navigating away.
 *
 * Pass `selectedId` / `selectedLabel` (the same signals given to the parent
 * `Option`) if you want the trigger button's label to stay in sync when the
 * currently-selected item is the one being renamed.
 */
SearchableSelect.EditableOptionBody = function (
	{
		label,
		onSave
	}: {
		label: string;
		onSave: (newLabel: string) => Promise<void>;

	}
)
{
	useSignals();

	const isEditing = useMemo(() => signal(false), []);
	const isSaving = useMemo(() => signal(false), []);
	const hasError = useMemo(() => signal(false), []);
	const draftValue = useMemo(() => signal(label), []);

	const startEditing = (e: React.SyntheticEvent) =>
	{
		e.preventDefault();
		e.stopPropagation();
		hasError.value = false;
		draftValue.value = label;
		isEditing.value = true;
	};

	const cancelEditing = () =>
	{
		isEditing.value = false;
		hasError.value = false;
		draftValue.value = label;
	};

	const commitEditing = async () =>
	{
		const trimmed = draftValue.value?.trim();
		if (!trimmed || trimmed === label)
		{
			cancelEditing();
			return;
		}
		isSaving.value = true;
		hasError.value = false;
		try
		{
			await onSave(trimmed);
			isEditing.value = false;
		}
		catch (error)
		{
			hasError.value = true;
		}
		finally
		{
			isSaving.value = false;
		}
	};

	if (isEditing.value)
	{
		return (
			<div
				className="flex flex-1 items-center gap-1"
				onClick={ (e) => e.stopPropagation() }
				onPointerDown={ (e) => e.stopPropagation() }
				onPointerUp={ (e) => e.stopPropagation() }
				onKeyDown={ (e) => e.stopPropagation() }
			>
				<TextField
					value={ draftValue.value }
					disabled={ isSaving.value }
					aria-label={ "edit" }
					onChange={ (e) =>
					{
						draftValue.value = e;
					} }
					onKeyDown={ (e) =>
					{
						if (e.key === "Enter")
						{
							e.preventDefault();
							void commitEditing();
						}
						if (e.key === "Escape")
						{
							e.preventDefault();
							cancelEditing();
						}
					} }

				/>
				{ isSaving.value
					? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground"/>
					: (
						<>
							<Button
								type="button"
								variant="default"
								onClick={ () => void commitEditing() }
								className="shrink-0 rounded-lg px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
								aria-label={ "save" }
							>
								<Check className="h-3.5 w-3.5"/>
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={ cancelEditing }
								className="shrink-0 rounded-lg px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
								aria-label={ "cancel" }
							>
								<X className="h-3.5 w-3.5"/>
							</Button>
						</>
					) }
			</div>
		);
	}

	return (
		<>
			<span className="flex-1 truncate">{ label }</span>
			<Button
				type="button"
				onClick={ startEditing }
				variant="outline"
				onPointerDown={ (e) => e.stopPropagation() }
				onPointerUp={ (e) => e.stopPropagation() }
				className="shrink-0 rounded-lg px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
				aria-label={ "edit" }
			>
				<Pencil className="h-3.5 w-3.5"/>
			</Button>
		</>
	);
};

SearchableSelect.Option = function <TDto extends Dto>(
	{id, label, labelSelector, item, onSelect, children}: SearchableSelectOptionProps<TDto> & PropsWithChildren
)
{
	useSignals();
	const data = useSearchableSelectContext();
	return (
		<CommandItem
			value={ item.id.toString() }
			onSelect={ () =>
			{
				if (id != undefined)
				{
					id.value = item.id;
				}
				if (label != undefined)
				{
					label.value = (item[labelSelector])?.toString();
				}
				onSelect?.(item);
				data.isOpen.value = false;
			} }
			className="cursor-pointer group"
		>
			<Check
				className={ cn(
					"h-4 w-4 ltr:mr-2 rtl:ml-2 shrink-0",
					item.id === id?.value ? "opacity-100" : "opacity-0"
				) }
			/>
			{ children }
		</CommandItem>
	);
};

SearchableSelect.NullOption = function (
	{id, label, onSelect}: Omit<SearchableSelectOptionProps<any>, "item" | "labelSelector">
)
{
	useSignals();
	const data = useSearchableSelectContext();
	return (
		<CommandItem
			value="all-items-option"
			onSelect={ () =>
			{
				if (id != undefined)
				{
					id.value = undefined;
				}
				if (label != undefined)
				{
					label.value = undefined;
				}
				onSelect?.();
				data.isOpen.value = false;
			} }
			className="cursor-pointer"
		>
			<Check
				className={ cn(
					"h-4 w-4 ltr:mr-2 rtl:ml-2",
					id?.value == undefined ? "opacity-100" : "opacity-0"
				) }
			/>
			<span className="italic text-red-500">
        { data.t("searchableSelect.nullOption") }
      </span>
		</CommandItem>
	);
};

SearchableSelect.DeleteOptionButton = function ({onDelete}: { onDelete: () => Promise<void>; })
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

SearchableSelect.EditOptionButton = function ({onEdit}: { onEdit: () => void; })
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

SearchableSelect.AddOptionButton = function (
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