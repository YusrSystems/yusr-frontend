import { BaseInput, BaseInputOld, type BaseInputProps, type BaseInputPropsOld } from "../inputs/baseInput";
import { FormField, FormFieldOld, type FormFieldProps } from "./formField";

export interface InputFieldPropsOld extends BaseInputPropsOld
{
  label: string;
  error?: string;
  required?: boolean;
}

export type InputFieldProps = BaseInputProps & FormFieldProps;

export function InputFieldOld({ label, error, isInvalid, required, ...props }: InputFieldPropsOld)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <BaseInputOld { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}

export function InputField({ label, error, required, ...props }: InputFieldProps)
{
  return (
    <FormField label={ label } error={ error } required={ required }>
      <BaseInput { ...props } />
    </FormField>
  );
}
