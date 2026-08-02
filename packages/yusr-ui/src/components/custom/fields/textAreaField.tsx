import { TextAreaInput, type TextAreaInputProps } from "../inputs/textAreaInput";
import { FormField, type FormFieldProps } from "./formField";


export function TextAreaField(
	{label, error, required, ...props}: TextAreaInputProps & FormFieldProps
)
{
	return (
		<FormField label={ label } error={ error } required={ required }>
			<TextAreaInput { ...props } error={ error }/>
		</FormField>
	);
}