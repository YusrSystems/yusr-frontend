import { type Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ChevronDown } from "lucide-react";
import React, { useMemo } from "react";
import { cn } from "../../../utils/cn";
import { Textarea } from "../../pure/textarea";

export interface TextAreaInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">
{
  error?: Signal<string | undefined>;
  value?: Signal<string | undefined>;
  onChange?: (value: string) => void;
  collapsible?: boolean;
  collapsedHeight?: number;
  expandedHeight?: number;
}

export function TextAreaInput({
  error,
  value,
  onChange,
  className,
  collapsible = false,
  collapsedHeight = 36,
  expandedHeight = 120,
  style,
  onFocus,
  onBlur,
  ...props
}: TextAreaInputProps)
{
  useSignals();
  const isFocused = useMemo(() => signal(false), []);
  const isCollapsed = collapsible && !isFocused.value;

  return (
    <div className="relative w-full">
      <Textarea
        { ...props }
        value={ value?.value ?? "" }
        onChange={ (event) =>
        {
          if (value)
          {
            value.value = event.target.value;
          }
          onChange?.(event.target.value);
        } }
        style={ {
          ...style,
          ...(collapsible && {
            height: isCollapsed ? collapsedHeight : expandedHeight,
            transition: "height 0.2s ease",
            overflowY: isCollapsed ? "hidden" : "auto",
            paddingBottom: isCollapsed ? "0.5rem" : undefined
          }),
          resize: collapsible ? "none" : "vertical"
        } }
        onFocus={ (e) =>
        {
          isFocused.value = true;
          onFocus?.(e);
        } }
        onBlur={ (e) =>
        {
          isFocused.value = false;
          onBlur?.(e);
        } }
        className={ cn(
          className,
          collapsible && "min-h-0",
          error?.value && "border-red-600 focus-visible:ring-red-600"
        ) }
      />
      { collapsible && isCollapsed && (
        <ChevronDown
          size={ 20 }
          className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      ) }
    </div>
  );
}
