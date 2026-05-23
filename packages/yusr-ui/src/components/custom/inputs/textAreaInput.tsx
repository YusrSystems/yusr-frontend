import { ChevronDown } from "lucide-react";
import React from "react";
import { cn } from "../../../utils/cn";
import { Textarea } from "../../pure/textarea";

export interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
{
  isInvalid?: boolean;
  collapsible?: boolean;
  collapsedHeight?: number;
  expandedHeight?: number;
}

export function TextAreaInput({
  isInvalid,
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
  const [isFocused, setIsFocused] = React.useState(false);
  const isCollapsed = collapsible && !isFocused;

  return (
    <div className="relative w-full">
      <Textarea
        { ...props }
        style={ {
          ...style,
          ...(collapsible && {
            height: isCollapsed ? collapsedHeight : expandedHeight,
            transition: "height 0.2s ease",
            overflowY: isCollapsed ? "hidden" : "auto",
            paddingBottom: isCollapsed ? "0.5rem" : undefined
          }),
          resize: "none"
        } }
        onFocus={ (e) =>
        {
          setIsFocused(true);
          onFocus?.(e);
        } }
        onBlur={ (e) =>
        {
          setIsFocused(false);
          onBlur?.(e);
        } }
        className={ cn(className, "min-h-0", isInvalid && "border-red-600 focus-visible:ring-red-600") }
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
