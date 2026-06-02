import { BaseInput, BaseInputOld, type BaseInputProps, type BaseInputPropsOld } from "../inputs/baseInput";
import { FormField } from "./formField";

export interface InputFieldPropsOld extends BaseInputPropsOld
{
  label: string;
  error?: string;
  required?: boolean;
}

export interface InputFieldProps extends BaseInputProps
{
  label: string;
  error?: string;
  required?: boolean;
}

export function InputFieldOld({ label, error, isInvalid, required, ...props }: InputFieldPropsOld)
{
  return (
    <FormField label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <BaseInputOld { ...props } isInvalid={ isInvalid } />
    </FormField>
  );
}

export function InputField({ label, error, isInvalid, required, ...props }: InputFieldProps)
{
  return (
    <FormField label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <BaseInput { ...props } isInvalid={ isInvalid } />
    </FormField>
  );
}
