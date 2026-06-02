import { DateInput, type DateInputProps } from "../inputs/dateInput";
import { FormFieldOld } from "./formField";

interface DateFieldProps extends DateInputProps
{
  label: string;
  error?: string;
  required?: boolean;
}

export function DateField({
  label,
  error,
  isInvalid,
  required,
  ...props
}: DateFieldProps)
{
  return (
    <FormFieldOld
      label={ label }
      error={ error }
      isInvalid={ isInvalid }
      required={ required }
    >
      <DateInput { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}
