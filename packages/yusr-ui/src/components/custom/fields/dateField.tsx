import { DateInput, type DateInputProps } from "../inputs/dateInput";
import { FormField } from "./formField";

interface DateFieldProps extends DateInputProps {
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
}: DateFieldProps) {
  return (
    <FormField
      label={label}
      error={error}
      isInvalid={isInvalid}
      required={required}
    >
      <DateInput {...props} isInvalid={isInvalid} />
    </FormField>
  );
}
