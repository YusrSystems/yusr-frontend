import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import type { ColumnName } from "yusr-core";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../../pure/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../pure/popover";
import { SearchInput } from "../inputs/searchInput";

type SearchableSelectParams<T> = {
  items: T[];
  itemLabelKey: keyof T;
  itemValueKey: keyof T;
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  placeholder?: string;
  columnsNames: ColumnName[];
  onSearch: (condition: { value: string; columnName: string; } | undefined) => void;
  showAllOption?: boolean;
};

export function SearchableSelect<T>(
  {
    items,
    itemLabelKey,
    itemValueKey,
    value,
    onValueChange,
    disabled,
    isInvalid,
    placeholder = "اختر...",
    columnsNames,
    onSearch,
    showAllOption = false
  }: SearchableSelectParams<T>
)
{
  const [open, setOpen] = React.useState(false);

  // Find the selected item's label to display in the button
  const selectedItem = items.find((item) => String(item[itemValueKey]) === value);

  const selectedLabel = selectedItem ? String(selectedItem[itemLabelKey]) : placeholder;

  return (
    <Popover open={ open } onOpenChange={ setOpen } modal={ true }>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={ open }
          disabled={ disabled }
          className={ cn(
            "w-full justify-between px-3 font-normal",
            !value && "text-muted-foreground",
            isInvalid? "error" : ""
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
        <SearchInput columnsNames={ columnsNames } onSearch={ onSearch } />

        { /* List Container */ }
        <Command shouldFilter={ false }>
          <CommandList className="max-h-50 overflow-y-auto overflow-x-hidden">
            { items.length === 0
              ? <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">لا توجد بيانات</CommandEmpty>
              : (
                <CommandGroup>

                {showAllOption && (
                  <CommandItem
                    value="all-items-option"
                    onSelect={() => {
                      onValueChange(undefined);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 ltr:mr-2 rtl:ml-2",
                        (value === undefined || value === "") ? "opacity-100" : "opacity-0"
                      )}
                    />
                    الكل
                  </CommandItem>
                )}

                  { items.map((item) =>
                  {
                    const itemValue = String(item[itemValueKey]);
                    const itemLabel = String(item[itemLabelKey]);
                    const isSelected = value === itemValue;

                    return (
                      <CommandItem
                        key={ itemValue }
                        value={ itemValue }
                        onSelect={ () =>
                        {
                          onValueChange(itemValue);
                          setOpen(false);
                        } }
                        className="cursor-pointer"
                      >
                        {
                          /*
                        Check Icon:
                        1. We use opacity-0/100 instead of removing it from DOM.
                           This keeps alignment consistent (like a native Select).
                        2. rtl/ltr classes ensure correct margins based on direction.
                      */
                        }
                        <Check
                          className={ cn("h-4 w-4 ltr:mr-2 rtl:ml-2", isSelected ? "opacity-100" : "opacity-0") }
                        />
                        { itemLabel }
                      </CommandItem>
                    );
                  }) }
                </CommandGroup>
              ) }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
