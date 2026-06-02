import { SelectInput, type SelectInputProps } from "../inputs/selectInput";
import { FormFieldOld } from "./formField";

export function SelectField(
  { label, error, required, isInvalid, ...props }: SelectInputProps & {
    label: string;
    error?: string;
    required?: boolean;
  }
)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <SelectInput { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}
