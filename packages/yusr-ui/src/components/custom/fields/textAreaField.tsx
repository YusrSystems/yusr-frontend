import { TextAreaInput, TextAreaInputOld, type TextAreaInputProps, type TextAreaInputPropsOld } from "../inputs/textAreaInput";
import { FormFieldOld } from "./formField";

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
