import { Signal } from "@preact/signals-react";
import { Checkbox } from "../../pure";
import { FormField, type FormFieldProps } from "./formField";
import { type InputFieldProps } from "./inputField";
import { useSignals } from "@preact/signals-react/runtime";
import type { ChangeEvent, ReactNode } from "react";
import { BaseInput, type BaseInputProps } from "../inputs/baseInput";
import { Label } from "../../pure/label";


interface CheckboxFieldProps extends Omit<InputFieldProps, "value" | "checked">
{
	checked: Signal<boolean> | boolean;
	onCheckedChange?: (checked: boolean) => void;
}

export function CheckboxField({id, checked, onCheckedChange, ...formFieldProps}: CheckboxFieldProps)
{
	useSignals();
	return (
		<FormField { ...formFieldProps }>
			<div
				className="flex items-center gap-3 rounded-lg border p-1.75 cursor-pointer border-border"
				onClick={ () =>
				{
					if (!(checked instanceof Signal))
					{
						return;
					}

					checked.value = !checked.value;
					onCheckedChange?.(checked.value);
				} }
			>
				<Checkbox
					id={ id }
					checked={ checked instanceof Signal ? checked.value : checked }
				/>
			</div>
		</FormField>
	);
}

export type CheckboxFieldLabelComponentProps = Omit<BaseInputProps, "checked"> & Omit<FormFieldProps, "label"> & {
	label: ReactNode;
	checked?: Signal<boolean>;
};

export function CheckboxFieldLabelComponent({
	label,
	error,
	required,
	checked,
	onChange,
	...props
}: CheckboxFieldLabelComponentProps)
{
	useSignals();

	return (
		<FormField error={ error }>
			<Label className="flex items-center gap-2 cursor-pointer">
				<div>
					<BaseInput
						checked={ checked?.value }
						onChangeCapture={ (e: ChangeEvent<HTMLInputElement>) =>
						{
							if (checked)
							{
								checked.value = e.target.checked;
								if (checked.value && error)
								{
									error.value = undefined;
								}
							}
						} }
						{ ...props }
						type="checkbox"
						className="mt-0.5"
					/>
				</div>
				<span className="text-sm font-medium">{ label }</span>
				{ required && <span className="text-red-500">*</span> }
			</Label>
		</FormField>
	);
}