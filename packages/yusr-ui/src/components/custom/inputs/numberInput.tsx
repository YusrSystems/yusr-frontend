import { type Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { cn } from "../../../utils/cn";
import { Input } from "../../pure/input";

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
{
  value: Signal<number | undefined> | Signal<number>;
  onChange?: (value: number | undefined) => void;
  currency?: React.ReactNode;
}

export function NumberInput(
  { value, onChange, min, max, className, currency, ...props }: NumberInputProps
)
{
  useSignals();
  const handleChange = (val: number | undefined) =>
  {
    if (val === undefined)
    {
      (value as Signal<number>).value = 0;
      return;
    }
    (value as Signal<number | undefined>).value = val;
    onChange?.(val);
  };

  const localValue: Signal<string> = useMemo(
    () => signal(value.value != null ? value.value.toString() : ""),
    [value]
  );

  useEffect(() =>
  {
    if (typeof value.value === "number" && isNaN(value.value))
    {
      localValue.value = "";
    }
    else
    {
      localValue.value = value.value != null ? value.value.toString() : "";
    }
  }, [value.value]);

  const input = (
    <Input
      { ...props }
      type="text"
      inputMode="decimal"
      min={ min }
      max={ max }
      value={ localValue }
      className={ cn(
        className,
        currency && "pe-8"
      ) }
      onChange={ (value) =>
      {
        value = value
          .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
          .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

        if (!/^-?\d*\.?\d*$/.test(value))
        {
          localValue.value = localValue.value.slice(0, -1);
          return;
        }

        localValue.value = value;

        if (value === "")
        {
          localValue.value = "0";
          handleChange(undefined);
          return;
        }

        if (value === "-" || value === "-0" || value.endsWith("."))
        {
          return; // Wait for more input before notifying the parent.
        }

        let val = Number(value);

        if (isNaN(val))
        {
          return;
        }

        if (min !== undefined && val < Number(min))
        {
          val = Number(min);
          localValue.value = String(val);
        }
        if (max !== undefined && val > Number(max))
        {
          val = Number(max);
          localValue.value = String(val);
        }

        handleChange(val);
      } }
      onBlur={ (e) =>
      {
        if (localValue.value === "-" || localValue.value === "-0")
        {
          localValue.value = "";
          onChange?.(undefined);
        }
        else if (localValue.value.endsWith("."))
        {
          const cleanVal = Number(localValue.value);
          localValue.value = isNaN(cleanVal) ? "" : cleanVal.toString();
        }

        props.onBlur?.(e);
      } }
    />
  );

  if (!currency)
  {
    return input;
  }

  return (
    <div className="relative flex items-center">
      <div className="absolute end-3 flex items-center pointer-events-none text-muted-foreground">
        { currency }
      </div>
      { input }
    </div>
  );
}
