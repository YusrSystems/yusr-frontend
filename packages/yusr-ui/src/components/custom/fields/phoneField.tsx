import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { PhoneInput } from "../inputs/phoneInput";
import { FormField } from "./formField";
import { InputFieldOld, type InputFieldPropsOld } from "./inputField";

export function PhoneFieldOld(props: InputFieldPropsOld)
{
  return <InputFieldOld { ...props } type="tel" dir="ltr" placeholder="05xxxxxxxx" className="text-right font-mono" />;
}

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
{
  error?: Signal<string | undefined>;
  value: Signal<string | undefined>;
  onChange?: (value: string | undefined) => void;
}

export function PhoneField({ error, required, ...props }: PhoneInputProps)
{
  useSignals();
  return (
    <FormField error={ error } required={ required }>
      <PhoneInput error={ error } { ...props } />
    </FormField>
  );
}
