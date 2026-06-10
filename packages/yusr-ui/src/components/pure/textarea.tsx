import * as React from "react";

import type { Signal } from "@preact/signals-react";
import { cn } from "../../utils/cn";

export function TextareaOld({ className, ...props }: React.ComponentProps<"textarea">)
{
  return (
    <textarea
      data-slot="textarea"
      className={ cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-3 aria-invalid:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      ) }
      { ...props }
    />
  );
}

export function Textarea(
  { className, value, onChange, ...props }: Omit<React.ComponentProps<"textarea">, "value" | "onChange"> & {
    value?: Signal<string | number | undefined>;
    onChange?: (value: string) => void;
  }
)
{
  return (
    <textarea
      data-slot="textarea"
      value={ value ? value.value : undefined }
      onChange={ (event) =>
      {
        if (value)
        {
          value.value = event.target.value;
        }
        onChange?.(event.target.value);
      } }
      className={ cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-3 aria-invalid:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      ) }
      { ...props }
    />
  );
}
