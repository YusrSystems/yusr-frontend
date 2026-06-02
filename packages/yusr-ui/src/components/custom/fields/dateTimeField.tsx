import { DateTimeInput, type DateTimeInputProps } from "../inputs/dateTimeInput";
import { FormFieldOld } from "./formField";

interface DateTimeFieldProps extends DateTimeInputProps
{
  label: string;
  error?: string;
  required?: boolean;
}

export function DateTimeField({ label, error, isInvalid, required, ...props }: DateTimeFieldProps)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <DateTimeInput { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}
