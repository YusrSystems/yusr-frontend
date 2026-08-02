import { DateInput, type DateInputProps } from "../inputs/dateInput.tsx";
import { FormField } from "./formField";
import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


interface DateFieldProps extends DateInputProps
{
	label: string;
	error?: Signal<string | undefined>;
	required?: boolean;
}

export function DateField({
	label,
	error,
	required,
	...props
}: DateFieldProps)
{
	useSignals();
	return (
		<FormField
			label={ label }
			error={ error }
			required={ required }
		>
			<DateInput { ...props } />
		</FormField>
	);
}
