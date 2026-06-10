import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { BaseInput } from "../inputs/baseInput";
import { FormField } from "./formField";
import { InputField, InputFieldOld, type InputFieldProps, type InputFieldPropsOld } from "./inputField";

export function TextFieldOld(props: InputFieldPropsOld)
{
  return <InputFieldOld { ...props } type="text" />;
}

export function TextField(props: InputFieldProps)
{
  return <InputField { ...props } type="text" />;
}

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
{
  error?: Signal<string | undefined>;
  value: Signal<string | undefined>;
  onChange?: (value: string | undefined) => void;
  currency?: React.ReactNode;
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

export function PhoneInput({ value, onChange, ...props }: PhoneInputProps)
{
  useSignals();

  const localValue: Signal<string> = useMemo(
    () =>
    {
      return signal(value.value ?? "");
    },
    [value]
  );

  return (
    <BaseInput
      { ...props }
      value={ localValue }
      type="tel"
      dir="ltr"
      placeholder="05xxxxxxxx"
      className="text-right font-mono"
      onChange={ (inputValue) =>
      {
        inputValue = inputValue
          .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
          .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

        // 2. Block invalid characters
        if (!/^-?\d*\.?\d*$/.test(inputValue))
        {
          localValue.value = localValue.value.slice(0, -1);
          return;
        }

        localValue.value = inputValue;
        value.value = inputValue;
        onChange?.(inputValue);
      } }
    />
  );
}
