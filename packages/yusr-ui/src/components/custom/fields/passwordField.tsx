import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { InputField, type InputFieldProps } from "./inputField";
import { cn } from "#/utils/cn.ts";


export function PasswordField(props: InputFieldProps)
{
	const [show, setShow] = useState(false);
	const hasLabel = Boolean(props.label);

	return (
		<div className="relative w-full">
			<InputField
				{ ...props }
				type={ show ? "text" : "password" }
				className={ cn("pe-10", props.className) }
			/>
			<button
				type="button"
				onClick={ () => setShow(!show) }
				className={ cn(
					"absolute inset-e-2.5 text-muted-foreground hover:text-foreground transition-colors",
					hasLabel ? "top-8.5" : "top-1/2 -translate-y-1/2"
				) }
				aria-label={ show ? "Hide password" : "Show password" }
			>
				{ show ? <EyeOff size={ 16 }/> : <Eye size={ 16 }/> }
			</button>
		</div>
	);
}