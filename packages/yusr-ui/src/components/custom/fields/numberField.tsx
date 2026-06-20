import { NumberInput, type NumberInputProps } from "../inputs/numberInput";
import { FormField, type FormFieldProps } from "./formField";
import React from "react";


type NumberFieldProps = NumberInputProps & FormFieldProps & {
	currency?: React.ReactNode;
};

export function NumberField({label, error, required, ...props}: NumberFieldProps)
{
	return (
		<FormField label={ label } error={ error } required={ required }>
			<NumberInput error={ error } { ...props } />
		</FormField>
	);
}
