import { Label } from "../../pure/label";

interface FormFieldProps
{
  label: string;
  error?: string;
  isInvalid?: boolean;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, isInvalid, children, required }: FormFieldProps)
{
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-1">
        <Label className="text-sm font-medium">{ label }</Label>
        { required && <span className="text-red-500">*</span> }
      </div>

      { children }

      { isInvalid && error && (
        <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{ error }</span>
      ) }
    </div>
  );
}
