import { type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Label } from "../../pure/label";

interface FormFieldPropsOld
{
  label?: string;
  error?: string;
  isInvalid?: boolean;
  children: React.ReactNode;
  required?: boolean;
}

export function FormFieldOld({ label, error, isInvalid, children, required }: FormFieldPropsOld)
{
  return (
    <div className="flex flex-col gap-1.5 w-full">
      { label
        && (
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">{ label }</Label>
            { required && <span className="text-red-500">*</span> }
          </div>
        ) }
      { children }

      { isInvalid && error && (
        <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{ error }</span>
      ) }
    </div>
  );
}

interface FormFieldProps
{
  label?: string;
  error?: Signal<string | undefined>;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, children, required }: FormFieldProps)
{
  return (
    <div className="flex flex-col gap-1.5 w-full">
      { label && (
        <div className="flex items-center gap-1">
          <Label className="text-sm font-medium">{ label }</Label>
          { required && <span className="text-red-500">*</span> }
        </div>
      ) }
      { children }
      <FieldError error={ error } />
    </div>
  );
}

function FieldError({ error }: { error?: Signal<string | undefined>; })
{
  useSignals();

  const message = error?.value;

  if (!message)
  {
    return null;
  }

  return (
    <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
      { message }
    </span>
  );
}
