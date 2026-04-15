import { DateTimeInput, type DateTimeInputProps } from "../inputs/dateTimeInput";
import { FormField } from "./formField";

interface DateTimeFieldProps extends DateTimeInputProps
{
  label: string;
  error?: string;
  required?: boolean;
}

export function DateTimeField({ label, error, isInvalid, required, ...props }: DateTimeFieldProps)
{
  return (
    <FormField label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <DateTimeInput { ...props } isInvalid={ isInvalid } />
    </FormField>
  );
}
