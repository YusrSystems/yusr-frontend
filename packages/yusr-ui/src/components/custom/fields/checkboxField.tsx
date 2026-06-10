import type { Signal } from "@preact/signals-react";
import { Checkbox } from "../../pure";
import { FormField } from "./formField";
import { type InputFieldProps } from "./inputField";
import { useSignals } from "@preact/signals-react/runtime";

interface CheckboxFieldProps extends Omit<InputFieldProps, "value" | "checked">
{
  checked: Signal<boolean>;
  onCheckedChange?: (checked: boolean) => void;
}

export function CheckboxField({ id, checked, onCheckedChange, ...formFieldProps }: CheckboxFieldProps)
{
  useSignals();
  return (
    <FormField { ...formFieldProps }>
      <div
        className="flex items-center gap-3 rounded-lg border p-1.75 cursor-pointer border-border"
        onClick={ () =>
        {
          checked.value = !checked.value;
          onCheckedChange?.(checked.value);
        } }
      >
        <Checkbox
          id={ id }
          checked={ checked.value }
        />
      </div>
    </FormField>
  );
}
