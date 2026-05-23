import { Check, ChevronsUpDown, Loader2, Trash2 } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import type { BaseEntity } from "../../../entities";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../pure/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../pure/popover";
import { SearchInput } from "../inputs/searchInput";

export type BasicSearchableSelectParams<T extends BaseEntity> = {
  items?: T[];
  selectedId?: number;
  selectedLabel?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  showAllOption?: boolean;
  buttonClassName?: string;
  onValueChange: (value?: T) => void;
};

type SearchableSelectParams<T extends BaseEntity> = BasicSearchableSelectParams<T> & {
  labelKey: keyof T;
  onSearch: (searchInput: string) => void;
  onNotFound?: (searchInput: string) => void;
  onDelete?: (entity: T) => Promise<boolean>;
};

export function SearchableSelect<T extends BaseEntity>(
  {
    items = [],
    selectedId,
    selectedLabel,
    labelKey,
    disabled,
    isInvalid,
    placeholder: customPlaceholder,
    isLoading = false,
    showAllOption = false,
    buttonClassName,
    onSearch,
    onValueChange,
    onNotFound,
    onDelete
  }: SearchableSelectParams<T>
)
{
  const { t, i18n } = useTranslation("common");
  const [open, setOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [deletingItem, setDeletingItem] = React.useState<T | undefined>(undefined);

  const placeholder = customPlaceholder || t("searchableSelect.placeholder");
  const displayLabel = selectedId ? (selectedLabel ?? placeholder) : placeholder;

  const showCreateOption = onNotFound && searchInput.trim() !== "";

  function onOpenChange(open: boolean)
  {
    setOpen(open);
    if (!open)
    {
      setSearchInput(""); // clear typed text on close
    }
  }

  function handleCreate()
  {
    onNotFound?.(searchInput);
    setSearchInput("");
    setOpen(false);
  }

  async function handleDelete(e: React.MouseEvent, item: T)
  {
    e.stopPropagation(); // prevent triggering onSelect
    setDeletingItem(item);

    const success = await onDelete?.(item);

    if (!success)
    {
      setDeletingItem(undefined); // reset spinner on failure
    }
    // If deleted item was selected, clear selection
    else if (selectedId === item.id)
    {
      onValueChange(undefined);
    }
  }

  return (
    <Popover open={ open } onOpenChange={ onOpenChange } modal={ true }>
      <PopoverTrigger asChild>
        <Button
          dir={ i18n.dir() }
          variant="outline"
          role="combobox"
          aria-expanded={ open }
          disabled={ disabled }
          className={ cn(
            "w-full justify-between px-3 font-normal",
            buttonClassName,
            !selectedId && "text-muted-foreground",
            isInvalid ? "error" : ""
          ) }
        >
          <span className="truncate text-start">{ displayLabel }</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ltr:ml-2 rtl:mr-2" />
        </Button>
      </PopoverTrigger>

      {
        /*
         w-[--radix-popover-trigger-width]: Matches width to the button
         p-0: Removes padding so the Command list sits flush
      */
      }
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" dir={ i18n.dir() }>
        { /* Search Input Header */ }
        <SearchInput<T>
          columnsNames={ [] }
          onSearch={ (con) =>
          {
            onSearch(con?.value ?? "");
            if (onNotFound)
            {
              // Only update typedValue when there's an actual value
              // Don't reset it when con is undefined (that just means "fetch all")
              if (con?.value !== undefined)
              {
                setSearchInput(con.value);
              }
            }
          } }
          onType={ (val) =>
          {
            if (onNotFound)
            {
              setSearchInput(val);
            }
          } }
        />

        { /* List Container */ }
        <Command shouldFilter={ false }>
          <CommandList className="max-h-50 overflow-y-auto overflow-x-hidden">
            { isLoading
              ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  <span className="text-sm">{ t("searchableSelect.loading") }</span>
                </div>
              )
              : (
                <>
                  { items.length === 0 && !showCreateOption && (
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                      { t("searchableSelect.noData") }
                    </CommandEmpty>
                  ) }

                  { (items.length > 0 || showCreateOption) && (
                    <CommandGroup>
                      { showAllOption && (
                        <CommandItem
                          value="all-items-option"
                          onSelect={ () =>
                          {
                            onValueChange(undefined);
                            setOpen(false);
                          } }
                          className="cursor-pointer"
                        >
                          <Check
                            className={ cn(
                              "h-4 w-4 ltr:mr-2 rtl:ml-2",
                              (selectedId === undefined) ? "opacity-100" : "opacity-0"
                            ) }
                          />
                          { t("searchableSelect.allOption") }
                        </CommandItem>
                      ) }

                      { items.map((item) =>
                      {
                        const isSelected = selectedId === item.id;
                        const isDeleting = deletingItem && selectedId === deletingItem?.id;

                        return (
                          <CommandItem
                            key={ item.id }
                            value={ String(item[labelKey]) }
                            onSelect={ () =>
                            {
                              console.log("onSelect", item);
                              onValueChange(item);
                              setOpen(false);
                            } }
                            className="cursor-pointer group"
                          >
                            <Check
                              className={ cn(
                                "h-4 w-4 ltr:mr-2 rtl:ml-2 shrink-0",
                                isSelected ? "opacity-100" : "opacity-0"
                              ) }
                            />

                            <span className="flex-1 truncate">{ String(item[labelKey]) }</span>

                            { onDelete && (
                              <div className="flex items-center justify-center min-w-[32px]">
                                { isDeleting
                                  ? (
                                    <Loader2 className="h-3.5 w-3.5 my-1.5 animate-spin text-muted-foreground shrink-0" />
                                  )
                                  : (
                                    <Button
                                      onClick={ (e) => handleDelete(e, item) }
                                      variant="destructive"
                                      size="sm"
                                      className={ "shrink-0 rounded-lg px-1.5 opacity-0 group-hover:opacity-100 transition-opacity" }
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  ) }
                              </div>
                            ) }
                          </CommandItem>
                        );
                      }) }

                      { items.length <= 0 && showCreateOption && (
                        <CommandItem
                          value={ `__create__${searchInput}` }
                          onSelect={ handleCreate }
                          className="cursor-pointer text-primary"
                        >
                          <span className="ltr:mr-2 rtl:ml-2">+</span>
                          { t("searchableSelect.addOption", { value: searchInput.trim() }) }
                        </CommandItem>
                      ) }
                    </CommandGroup>
                  ) }
                </>
              ) }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}