import { type ClipboardEvent, type KeyboardEvent, useRef } from "react";
import { cn } from "../../../utils/cn";

interface OtpInputProps
{
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, length = 6, disabled = false }: OtpInputProps)
{
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focus = (index: number) =>
  {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (index: number, char: string) =>
  {
    if (!/^\d*$/.test(char))
    {
      return; // digits only
    }
    const chars = value.split("");
    chars[index] = char.slice(-1); // take last typed char
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (char && index < length - 1)
    {
      focus(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === "Backspace")
    {
      if (value[index])
      {
        const chars = value.split("");
        chars[index] = "";
        onChange(chars.join(""));
      }
      else if (index > 0)
      {
        const chars = value.split("");
        chars[index - 1] = "";
        onChange(chars.join(""));
        focus(index - 1);
      }
    }
    else if (e.key === "ArrowLeft")
    {
      focus(index - 1);
    }
    else if (e.key === "ArrowRight")
    {
      focus(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) =>
  {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    focus(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex gap-2" dir="ltr">
      { Array.from({ length }).map((_, i) => (
        <input
          key={ i }
          ref={ (el) =>
          {
            inputsRef.current[i] = el;
          } }
          type="text"
          inputMode="numeric"
          maxLength={ 1 }
          value={ value[i] ?? "" }
          disabled={ disabled }
          aria-label={ `Digit ${i + 1}` }
          onChange={ (e) => handleChange(i, e.target.value) }
          onKeyDown={ (e) => handleKeyDown(i, e) }
          onPaste={ handlePaste }
          onFocus={ (e) => e.target.select() }
          className={ cn(
            "w-11 h-13 text-center text-lg font-medium rounded-md border bg-background",
            "focus:outline-none focus:ring-2 focus:ring-gray-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            value[i] ? "border-gray-500" : "border-input"
          ) }
        />
      )) }
    </div>
  );
}
