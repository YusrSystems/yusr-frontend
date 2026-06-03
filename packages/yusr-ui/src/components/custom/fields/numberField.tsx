import { NumberInput, type NumberInputProps } from "../inputs/numberInput";
import { NumberInputOld, type NumberInputPropsOld } from "../inputs/numberInputOld";
import { FormField, FormFieldOld, type FormFieldProps } from "./formField";

interface NumberFieldPropsOld extends NumberInputPropsOld
{
  label?: string;
  error?: string;
  required?: boolean;
  currency?: React.ReactNode;
}

type NumberFieldProps = NumberInputProps & FormFieldProps & {
  currency?: React.ReactNode;
};

export function NumberFieldOld({ label, error, isInvalid, required, ...props }: NumberFieldPropsOld)
{
  return (
    <FormFieldOld label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <NumberInputOld { ...props } isInvalid={ isInvalid } />
    </FormFieldOld>
  );
}

export function NumberField({ label, error, required, ...props }: NumberFieldProps)
{
  return (
    <FormField label={ label } error={ error } required={ required }>
      <NumberInput { ...props } />
    </FormField>
  );
}
