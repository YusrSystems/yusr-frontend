import { NumberInput, type NumberInputProps } from "../inputs/numberInput";
import { FormFieldOld } from "./formField";

interface NumberFieldProps extends NumberInputProps
{
  label?: string;
  error?: string;
  required?: boolean;
  currency?: React.ReactNode;
}

export function NumberField({ label, error, isInvalid, required, ...props }: NumberFieldProps)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <NumberInput { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}
