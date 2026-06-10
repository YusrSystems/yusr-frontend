import { TextAreaInput, type TextAreaInputProps } from "../inputs/textAreaInput";
import { TextAreaInputOld, type TextAreaInputPropsOld } from "../inputs/textAreaInputOld";
import { FormField, FormFieldOld, type FormFieldProps } from "./formField";

export function TextAreaFieldOld(
  { label, error, isInvalid, required, ...props }: TextAreaInputPropsOld & {
    label: string;
    error?: string;
    required?: boolean;
  }
)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <TextAreaInputOld { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}

export function TextAreaField(
  { label, error, required, ...props }: TextAreaInputProps & FormFieldProps
)
{
  return (
    <FormField label={ label } error={ error } required={ required }>
      <TextAreaInput { ...props } error={ error } />
    </FormField>
  );
}
