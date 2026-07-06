import type { Signal } from "@preact/signals-react";
import { FormField } from "#/components/custom";
import { MultiSelectInput } from "#/components/custom/inputs/multiSelectInput.tsx";


export interface MultiSelectFieldProps<T extends string | number>
{
	label: string;
	value: Signal<T[]>;
	options: { label: string; value: T }[];
	placeholder?: string;
	disabled?: boolean;
	error?: Signal<string | undefined>;
	required?: boolean;
}

export function MultiSelectField<T extends string | number>(
	{label, error, required, ...props}: MultiSelectFieldProps<T>
)
{
	return (
		<FormField label={ label } error={ error } required={ required }>
			<MultiSelectInput<T> { ...props } />
		</FormField>
	);
}