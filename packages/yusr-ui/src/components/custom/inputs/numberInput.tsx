import { type Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { cn } from "../../../utils/cn";
import { BaseInput } from "./baseInput";


export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
{
	error?: Signal<string | undefined>;
	value: Signal<number | undefined>;
	onChange?: (value: number | undefined) => void;
	currency?: React.ReactNode;
}

export function NumberInput(
	{value, onChange, min, max, className, currency, onBlur, ...props}: NumberInputProps
)
{
	useSignals();

	const localValue: Signal<string> = useMemo(
		() => signal(value.value != undefined ? value.value.toString() : ""),
		[value.value]
	);

	const input = (
		<BaseInput
			{ ...props }
			type="text"
			inputMode="decimal"
			min={ min }
			max={ max }
			value={ localValue }
			className={ cn(
				className,
				currency && "pe-8"
			) }
			onChange={ (inputValue) =>
			{
				// 1. Normalize Arabic/Persian digits
				inputValue = inputValue
					.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
					.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

				// 2. Block invalid characters
				if (!/^-?\d*\.?\d*$/.test(inputValue))
				{
					localValue.value = localValue.value.slice(0, -1);
					return;
				}

				// 3. Mid-typing states — not a number yet, just update display

				if (!inputValue)
				{
					localValue.value = inputValue;
					value.value = 0;
					onChange?.(0);
					return;
				}

				const isMidTyping =
					inputValue === "-" ||
					inputValue === "." ||
					inputValue === "-." ||
					inputValue.endsWith(".");
				if (isMidTyping)
				{
					localValue.value = inputValue;
					// value.value = 0;
					// onChange?.(0);
					return;
				}

				// 4. Block leading zeros ("0013" → reject, but "0", "0.5" are fine)
				if (/^-?0\d/.test(inputValue))
				{
					localValue.value = localValue.value.slice(0, -1);
					return;
				}

				// 5. Normalize dot-leading input (".5" → "0.5")
				if (inputValue.startsWith(".") || inputValue.startsWith("-."))
				{
					const sign = inputValue.startsWith("-") ? "-" : "";
					inputValue = sign + "0." + inputValue.slice(sign ? 2 : 1);
				}

				// 6. Normal number — parse, clamp, commit
				let val = Number(inputValue);
				if (isNaN(val))
				{
					localValue.value = "";
					value.value = undefined;
					onChange?.(undefined);
					return;
				}

				if (min !== undefined)
				{
					val = Math.max(val, Number(min));
				}
				if (max !== undefined)
				{
					val = Math.min(val, Number(max));
				}

				localValue.value = String(val);
				value.value = val;
				onChange?.(val);
			} }
			onBlur={ (e) =>
			{
				if (!e.target.value && min != undefined)
				{
					value.value = Number(min);
				}
				onBlur?.(e);
			} }
		/>
	);

	if (!currency)
	{
		return input;
	}

	return (
		<div className="relative flex items-center">
			<div className="absolute end-3 flex items-center pointer-events-none text-muted-foreground">
				{ currency }
			</div>
			{ input }
		</div>
	);
}
