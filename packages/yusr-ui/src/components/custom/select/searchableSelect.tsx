import { Check, ChevronsUpDown, Loader2, Trash2 } from "lucide-react";
import * as React from "react";
import type { ColumnName } from "yusr-core";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../pure/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../pure/popover";
import { SearchInput } from "../inputs/searchInput";

export type EntitySearchableSelectParams<T> = {
  id?: number;
  disabled?: boolean;
  isInvalid?: boolean;
  onValueChange: (value: T) => void;
};

type SearchableSelectParams<T> = {
  items: T[];
  itemLabelKey: keyof T;
  itemValueKey: keyof T;
  value: string | undefined;
  disabled?: boolean;
  isInvalid?: boolean;
  placeholder?: string;
  columnsNames: ColumnName[];
  isLoading?: boolean;
  showAllOption?: boolean;
  buttonClassName?: string;
  onSearch: (condition: { value: string; columnName: string; } | undefined) => void;
  onValueChange: (value: string | undefined) => void;
  onNotFound?: (typedValue: string) => void;
  onDelete?: (id: number) => Promise<boolean>;
};

export function SearchableSelect<T>(
  {
    items,
    itemLabelKey,
    itemValueKey,
    value,
    disabled,
    isInvalid,
    placeholder = "اختر...",
    columnsNames,
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
  const [open, setOpen] = React.useState(false);
  const [typedValue, setTypedValue] = React.useState("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Find the selected item's label to display in the button
  const selectedItem = items.find((item) => String(item[itemValueKey]) === value);
  const selectedLabel = selectedItem ? String(selectedItem[itemLabelKey]) : placeholder;

  const showCreateOption = onNotFound
    && typedValue.trim() !== ""
    && !items.some(
      (item) => String(item[itemLabelKey]).toLowerCase() === typedValue.trim().toLowerCase()
    );

  function handleOpenChange(next: boolean)
  {
    setOpen(next);
    if (!next)
    {
      setTypedValue(""); // clear typed text on close
    }
  }

  function handleCreate()
  {
    onNotFound?.(typedValue.trim());
    setTypedValue("");
    setOpen(false);
  }

  async function handleDelete(e: React.MouseEvent, itemValue: string)
  {
    e.stopPropagation(); // prevent triggering onSelect
    setDeletingId(itemValue);

    const success = await onDelete?.(Number(itemValue));

    if (!success)
    {
      setDeletingId(null); // reset spinner on failure
    }
    // If deleted item was selected, clear selection
    else if (value === itemValue)
    {
      onValueChange(undefined);
    }
  }

  return (
    <Popover open={ open } onOpenChange={ handleOpenChange } modal={ true }>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={ open }
          disabled={ disabled }
          className={ cn(
            "w-full justify-between px-3 font-normal",
            buttonClassName,
            !value && "text-muted-foreground",
            isInvalid ? "error" : ""
          ) }
        >
          <span className="truncate text-start">{ selectedLabel }</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ltr:ml-2 rtl:mr-2" />
        </Button>
      </PopoverTrigger>

      {
        /*
         w-[--radix-popover-trigger-width]: Matches width to the button
         p-0: Removes padding so the Command list sits flush
      */
      }
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" dir="rtl">
        { /* Search Input Header */ }
        <SearchInput
          columnsNames={ columnsNames }
          onSearch={ (con) =>
          {
            onSearch(con);
            if (onNotFound)
            {
              // Only update typedValue when there's an actual value
              // Don't reset it when con is undefined (that just means "fetch all")
              if (con?.value !== undefined)
              {
                setTypedValue(con.value);
              }
            }
          } }
          onType={ (val) =>
          {
            if (onNotFound)
            {
              setTypedValue(val);
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
                  <span className="text-sm">جاري التحميل...</span>
                </div>
              )
              : (
                <>
                  { items.length === 0 && !showCreateOption && (
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                      لا توجد بيانات
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
                              (value === undefined || value === "") ? "opacity-100" : "opacity-0"
                            ) }
                          />
                          الكل
                        </CommandItem>
                      ) }

                      { items.map((item) =>
                      {
                        const itemValue = String(item[itemValueKey]);
                        const itemLabel = String(item[itemLabelKey]);
                        const isSelected = value === itemValue;
                        const isDeleting = deletingId === itemValue;

                        return (
                          <CommandItem
                            key={ itemValue }
                            value={ itemValue }
                            onSelect={ () =>
                            {
                              onValueChange(itemValue);
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

                            <span className="flex-1 truncate">{ itemLabel }</span>

                            { onDelete && (
                              <div className="flex items-center justify-center min-w-[32px]">
                                { isDeleting
                                  ? (
                                    <Loader2 className="h-3.5 w-3.5 my-1.5 animate-spin text-muted-foreground shrink-0" />
                                  )
                                  : (
                                    <Button
                                      onClick={ (e) => handleDelete(e, itemValue) }
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
                          value={ `__create__${typedValue}` }
                          onSelect={ handleCreate }
                          className="cursor-pointer text-primary"
                        >
                          <span className="ltr:mr-2 rtl:ml-2">+</span>
                          إضافة "{ typedValue.trim() }"
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
