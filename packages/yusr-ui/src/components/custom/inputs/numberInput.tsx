import { useEffect, useState } from "react";
import { cn } from "../../../utils/cn";
import { Input } from "../../pure/input";

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
{
  isInvalid?: boolean;
  value?: string | number;
  onChange?: (val: number | undefined) => void;
  currency?: React.ReactNode;
}

export function NumberInput({ value, onChange, min, max, isInvalid, className, currency, ...props }: NumberInputProps)
{
  const [localValue, setLocalValue] = useState<string | number>(value ?? "");

  useEffect(() =>
  {
    setLocalValue(value ?? "");
  }, [value]);

  const input = (
    <Input
      { ...props }
      type="number"
      min={ min }
      max={ max }
      value={ localValue }
      className={ cn(
        className,
        currency && "pl-8",
        isInvalid && "border-red-600 ring-red-600 text-red-900"
      ) }
      onChange={ (e) =>
      {
        const rawValue = e.target.value;

        setLocalValue(rawValue);

        if (rawValue === "")
        {
          onChange?.(undefined);
          return;
        }

        // Allow intermediate typing states: "-" or "-0" or "3."
        if (rawValue === "-" || rawValue === "-0" || rawValue.endsWith("."))
        {
          return; // Wait for more input, don't call parent onChange yet
        }

        let val = Number(rawValue);

        if (isNaN(val))
        {
          return;
        }

        if (min !== undefined && val < Number(min))
        {
          val = Number(min);
          setLocalValue(val);
        }
        if (max !== undefined && val > Number(max))
        {
          val = Number(max);
          setLocalValue(val);
        }

        onChange?.(val);
      } }
      onBlur={ (e) =>
      {
        // Clean up invalid trailing characters if the user clicks away
        if (localValue === "-" || localValue === "-0")
        {
          setLocalValue("");
          onChange?.(undefined);
        }
        else if (typeof localValue === "string" && localValue.endsWith("."))
        {
          const cleanVal = Number(localValue);
          setLocalValue(isNaN(cleanVal) ? "" : cleanVal);
        }

        // Trigger any parent onBlur if passed
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
      <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
        { currency }
      </div>
      { input }
    </div>
  );
}
