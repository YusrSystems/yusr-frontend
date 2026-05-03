import type { FilterCondition } from "../../../entities";
import type { ColumnName } from "../../../types";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../../pure/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../pure/select";

type SearchInputParams<T> = {
  columnsNames: ColumnName<T>[];
  onSearch: (condition: FilterCondition<T> | undefined) => void;
  onType?: (value: string) => void;
};

export function SearchInput<T>({ columnsNames, onSearch, onType }: SearchInputParams<T>)
{
  const [filterCondition, setFilterCondition] = useState<FilterCondition<T>>({
    value: "",
    columnName: columnsNames[0]?.value
  });

  const debouncedAction = useDebouncedCallback((value: string, column: keyof T) =>
  {
    if (!value.trim())
    {
      onSearch(undefined);
    }
    else
    {
      onSearch({ value: value, columnName: column });
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const val = e.target.value;
    setFilterCondition((prev) => ({ ...prev, value: val }));
    onType?.(val);

    if (!val)
    {
      debouncedAction.cancel();
      onSearch(undefined);
    }
    else
    {
      debouncedAction(val, filterCondition.columnName);
    }
  };

  const handleColumnChange = (value: string) =>
  {
    const column = value as keyof T;

    setFilterCondition((prev) => ({ ...prev, columnName: column }));

    if (filterCondition.value.trim())
    {
      debouncedAction(filterCondition.value, column);
    }
  };

  return (
    <div className="p-3 rounded-t-xl border-x border-t flex flex-col sm:flex-row gap-4 bg-muted z-0">
      <div className="relative w-full flex gap-2">
        { /* Shadcn Select for Columns */ }
        { columnsNames.length > 1 && (
          <Select dir="rtl" value={ filterCondition.columnName.toString() } onValueChange={ handleColumnChange }>
            <SelectTrigger className="bg-secondary border-none">
              <SelectValue placeholder="اختر العمود" />
            </SelectTrigger>
            <SelectContent>
              { columnsNames.map((col) => (
                <SelectItem key={ col.value.toString() } value={ col.value.toString() }>{ col.label }</SelectItem>
              )) }
            </SelectContent>
          </Select>
        ) }

        { /* Search Icon & Input */ }
        <div className="relative flex-1 z-10">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={ filterCondition.value }
            onChange={ handleInputChange }
            placeholder="ابحث..."
            className="pr-10 bg-background border focus-visible:ring-1"
          />
        </div>
      </div>
    </div>
  );
}
