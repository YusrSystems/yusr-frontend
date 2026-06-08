import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../pure/select";

export interface SelectInputPropsOld
{
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string; }[];
  placeholder?: string;
  isInvalid?: boolean;
  disabled?: boolean;
}

export function SelectInputOld({ value, onValueChange, options, placeholder, isInvalid, disabled }: SelectInputPropsOld)
{
  const { i18n } = useTranslation();
  return (
    <Select value={ value } onValueChange={ onValueChange } dir={ i18n.dir() } disabled={ disabled }>
      <SelectTrigger className={ cn("w-full", isInvalid && "border-red-600 ring-red-600 text-red-900") }>
        <SelectValue placeholder={ placeholder } />
      </SelectTrigger>
      <SelectContent>
        { options.map((opt) => <SelectItem key={ opt.value } value={ opt.value }>{ opt.label }</SelectItem>) }
      </SelectContent>
    </Select>
  );
}

export interface SelectInputProps<T>
{
  value: Signal<T | undefined>;
  onValueChange?: (value: T) => void;
  options: { label: string; value: T | undefined; }[];
  placeholder?: string;
  disabled?: boolean;
}

export function SelectInput<T extends string | number | boolean | undefined>(
  { value, onValueChange, options, placeholder, disabled }: SelectInputProps<T>
)
{
  useSignals();
  const { t, i18n } = useTranslation("common");
  return (
    <Select
      value={ String(value.value ?? t("searchableSelect.nullOption")) }
      onValueChange={ (val) =>
      {
        const match = options.find((o) => String(o.value) === val);
        value.value = match ? match.value : undefined;
        onValueChange?.(val as T);
      } }
      dir={ i18n.dir() }
      disabled={ disabled }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={ placeholder } />
      </SelectTrigger>
      <SelectContent>
        { options.map((opt) => (
          <SelectItem key={ String(opt.value) } value={ String(opt.value) }>{ opt.label }</SelectItem>
        )) }
      </SelectContent>
    </Select>
  );
}
