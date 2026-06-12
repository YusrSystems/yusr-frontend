import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { PhoneInputProps } from "../fields/phoneField";
import { BaseInput } from "./baseInput";

export function PhoneInput({ value, onChange, ...props }: PhoneInputProps)
{
  useSignals();

  const { i18n } = useTranslation(["common"]);

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
      dir={ i18n.dir() }
      placeholder="05xxxxxxxx"
      className="font-mono"
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
