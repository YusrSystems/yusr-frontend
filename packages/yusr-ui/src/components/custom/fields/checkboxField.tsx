import { type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import type { ChangeEvent, ReactNode } from "react";
import { BaseInput, type BaseInputProps } from "../inputs/baseInput";
import { FormField, type FormFieldProps } from "./formField";
import { Label } from "../../pure/label";


export type CheckboxFieldProps = Omit<BaseInputProps, "checked"> & Omit<FormFieldProps, "label"> & {
	label: ReactNode;
	checked?: Signal<boolean>;
};

export function CheckboxField({label, error, required, checked, onChange, ...props}: CheckboxFieldProps)
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