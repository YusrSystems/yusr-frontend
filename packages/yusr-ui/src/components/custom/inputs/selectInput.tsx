import { cn } from "../../../utils/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../pure/select";

export interface SelectInputProps
{
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string; }[];
  placeholder?: string;
  isInvalid?: boolean;
  disabled?: boolean;
}

export function SelectInput({ value, onValueChange, options, placeholder, isInvalid, disabled }: SelectInputProps)
{
  return (
    <Select value={ value } onValueChange={ onValueChange } dir="rtl" disabled={ disabled }>
      <SelectTrigger className={ cn("w-full", isInvalid && "border-red-600 ring-red-600 text-red-900") }>
        <SelectValue placeholder={ placeholder } />
      </SelectTrigger>
      <SelectContent>
        { options.map((opt) => <SelectItem key={ opt.value } value={ opt.value }>{ opt.label }</SelectItem>) }
      </SelectContent>
    </Select>
  );
}
