import { SelectInput, SelectInputOld, type SelectInputProps, type SelectInputPropsOld } from "../inputs/selectInput";
import { FormField, FormFieldOld, type FormFieldProps } from "./formField";

export function SelectFieldOld(
  { label, error, required, isInvalid, ...props }: SelectInputPropsOld & {
    label: string;
    error?: string;
    required?: boolean;
  }
)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <SelectInputOld { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}

type SelectFieldProps<T extends string | number | boolean> = SelectInputProps<T> & FormFieldProps;

export function SelectField<T extends string | number | boolean>(
  { label, error, required, ...props }: SelectFieldProps<T>
)
{
  return (
    <FormField label={ label } error={ error } required={ required }>
      <SelectInput<T> { ...props } />
    </FormField>
  );
}
