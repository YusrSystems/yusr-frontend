import { TextAreaInput, type TextAreaInputProps } from "../inputs/textAreaInput";
import { FormFieldOld } from "./formField";

export function TextAreaField(
  { label, error, isInvalid, required, ...props }: TextAreaInputProps & {
    label: string;
    error?: string;
    required?: boolean;
  }
)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <TextAreaInput { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}
