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

// Helper function to add commas to the integer part of the string
const formatWithCommas = (str: string) =>
{
	if (!str) return "";
	const parts = str.split(".");
	// Add commas every 3 digits, but only to the whole number part
	parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

export function NumberInput({
	value, onChange, min, max, className, currency, onBlur, ...props
}: NumberInputProps)
{
	useSignals();

	const localValue: Signal<string> = useMemo(
		() => signal(value.value != undefined ? formatWithCommas(value.value.toString()) : ""),
		[value.value]
	);

	const input = (
		<BaseInput
			{ ...props }
			type="text"
			inputMode="decimal"
			min={ min }
			max={ max }
			value={ localValue.value }
			className={ cn(className, currency && "pe-8") }
			onChange={ (inputValue) =>
			{
				// 0. Strip existing commas before processing
				let rawValue = inputValue.replace(/,/g, "");

				// 1. Normalize Arabic/Persian digits
				rawValue = rawValue
					.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
					.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

				// 2. Block invalid characters
				if (!/^-?\d*\.?\d*$/.test(rawValue))
				{
					// Revert to previous valid state (fixed from original slice bug)
					const temp = localValue.value;
					localValue.value = ""; // Force signal trigger
					localValue.value = temp;
					return;
				}

				// 3. Mid-typing states — not a number yet, just update display
				if (!rawValue)
				{
					localValue.value = "";
					value.value = 0;
					onChange?.(0);
					return;
				}

				const isMidTyping =
					rawValue === "-" ||
					rawValue === "." ||
					rawValue === "-." ||
					rawValue.endsWith(".");

				if (isMidTyping)
				{
					localValue.value = formatWithCommas(rawValue);
					return;
				}

				// 4. Block leading zeros ("0013" → reject, but "0", "0.5" are fine)
				if (/^-?0\d/.test(rawValue))
				{
					return;
				}

				// 5. Normalize dot-leading input (".5" → "0.5")
				if (rawValue.startsWith(".") || rawValue.startsWith("-."))
				{
					const sign = rawValue.startsWith("-") ? "-" : "";
					rawValue = sign + "0." + rawValue.slice(sign ? 2 : 1);
				}

				// 6. Normal number — parse, clamp, commit
				let val = Number(rawValue);
				if (isNaN(val))
				{
					localValue.value = "";
					value.value = undefined;
					onChange?.(undefined);
					return;
				}

				let clampedVal = val;
				let wasClamped = false;

				if (min !== undefined && val < Number(min))
				{
					clampedVal = Number(min);
					wasClamped = true;
				}
				if (max !== undefined && val > Number(max))
				{
					clampedVal = Number(max);
					wasClamped = true;
				}

				// If the number was clamped, we format the clamped value.
				// If NOT clamped, we format the `rawValue` string directly.
				// This prevents bugs where typing "1.0" immediately deletes the ".0".
				localValue.value = wasClamped
					? formatWithCommas(String(clampedVal))
					: formatWithCommas(rawValue);

				value.value = clampedVal;
				onChange?.(clampedVal);
			} }
			onBlur={ (e) =>
			{
				// Strip commas on blur check just in case
				const unformattedEventValue = e.target.value.replace(/,/g, "");
				if (!unformattedEventValue && min != undefined)
				{
					value.value = Number(min);
					localValue.value = formatWithCommas(String(min));
				}
				onBlur?.(e);
			} }
		/>
	);

	if (!currency) return input;

	return (
		<div className="relative flex items-center">
			<div className="absolute end-3 flex items-center pointer-events-none text-muted-foreground">
				{ currency }
			</div>
			{ input }
		</div>
	);
}