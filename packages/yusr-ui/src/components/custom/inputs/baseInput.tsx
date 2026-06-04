import type { Signal } from "@preact/signals-react";
import type React from "react";
import { cn } from "../../../utils/cn";
import { Input, InputOld } from "../../pure/input";
import { useSignals } from "@preact/signals-react/runtime";

export interface BaseInputPropsOld extends React.InputHTMLAttributes<HTMLInputElement>
{
  isInvalid?: boolean;
}

export interface BaseInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">
{
  error?: Signal<string | undefined>;
  value?: Signal<string | number | undefined>;
  onChange?: (value: string) => void;
}

export function BaseInputOld({ isInvalid, className, ...props }: BaseInputPropsOld)
{
  return (
    <InputOld
      { ...props }
      className={ cn(className, isInvalid && "border-red-500 ring-red-500 text-red-900 focus-visible:ring-red-500") }
    />
  );
}

export function BaseInput({ className, error, ...props }: BaseInputProps)
{
  useSignals();
  return (
    <Input
      { ...props }
      className={ cn(className, error?.value && "border border-red-500 ring-red-500 text-red-900 focus-visible:ring-red-500") }
    />
  );
}
