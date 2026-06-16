import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { Calendar } from "../../pure/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../pure/popover";
import { signal, type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


export interface DateInputPropsOld
{
	value?: Date;
	onChange: (date: Date | undefined) => void;
	isInvalid?: boolean;
	placeholder?: string;
	locale?: any;
	startYear?: number;
	endYear?: number;
	minDate?: Date;
	maxDate?: Date;
}

export function DateInputOld({
	value: comingValue,
	onChange,
	isInvalid,
	placeholder,
	locale,
	startYear = new Date().getFullYear() - 100,
	endYear = new Date().getFullYear() + 10,
	minDate,
	maxDate
}: DateInputPropsOld)
{
	const [value, setValue] = useState<Date | undefined>(comingValue);
	const [isOpen, setIsOpen] = useState(false);
	const {t, i18n} = useTranslation("common");
	const defaultPlaceholder = placeholder || t("dateInput.placeholder");
	const dateFnsLocale = locale ?? (i18n.language === "ar" ? arSA : enUS);

	const disabledDays = [];
	if (minDate)
	{
		disabledDays.push({before: minDate});
	}
	if (maxDate)
	{
		disabledDays.push({after: maxDate});
	}

	useEffect(() =>
	{
		if (comingValue)
		{
			const local = new Date(comingValue.getFullYear(), comingValue.getMonth(), comingValue.getDate());
			setValue(local);
		}
		else
		{
			setValue(undefined);
		}
	}, [comingValue]);

	return (
		<Popover open={ isOpen } onOpenChange={ setIsOpen }>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={ cn(
						"w-full justify-between text-left font-normal",
						!value && "text-muted-foreground",
						isInvalid && "border-red-600 ring-red-600 text-red-900"
					) }
				>
					{ value
						? (
							format(value, "PPP", {locale: dateFnsLocale})
						)
						: <span>{ defaultPlaceholder }</span> }
					<ChevronDownIcon className="h-4 w-4 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={ value }
					onSelect={ (date) =>
					{
						if (date)
						{
							const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
							onChange(local);
							setValue(local);
						}
						else
						{
							onChange(undefined);
							setValue(undefined);
						}
						setIsOpen(false);
					} }
					locale={ dateFnsLocale }
					captionLayout="dropdown"
					disabled={ disabledDays }
					startMonth={ minDate || new Date(startYear, 0) }
					endMonth={ maxDate || new Date(endYear, 11) }
				/>
			</PopoverContent>
		</Popover>
	);
}

export interface DateInputProps
{
	value?: Signal<Date | undefined>;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	locale?: any;
	startYear?: number;
	endYear?: number;
	minDate?: Date;
	maxDate?: Date;
	disabled?: boolean;
}

export function DateInput({
	value,
	onChange,
	placeholder,
	locale,
	startYear = new Date().getFullYear() - 100,
	endYear = new Date().getFullYear() + 10,
	minDate,
	maxDate,
	disabled
}: DateInputProps)
{
	useSignals();
	const isOpen: Signal<boolean> = useMemo(() =>
	{
		return signal(false);
	}, []);

	const {t, i18n} = useTranslation("common");
	const defaultPlaceholder = placeholder || t("dateInput.placeholder");
	const dateFnsLocale = locale ?? (i18n.language === "ar" ? arSA : enUS);

	const disabledDays = [];
	if (minDate)
	{
		disabledDays.push({before: minDate});
	}
	if (maxDate)
	{
		disabledDays.push({after: maxDate});
	}

	useEffect(() =>
	{
		console.log(value);
		if (value?.value)
		{
			const local = new Date(value?.value.getFullYear(), value?.value.getMonth(), value?.value.getDate());
			if (value?.value)
			{
				value.value = local;

			}
		}
		else
		{
			if (value?.value)
			{
				value.value = undefined;
			}
		}
	}, [value]);

	return (
		<Popover open={ isOpen.value } onOpenChange={ () =>
		{
			isOpen.value = !isOpen.value;
		} }>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={ cn(
						"w-full justify-between text-left font-normal",
						!value && "text-muted-foreground"
						// isInvalid && "border-red-600 ring-red-600 text-red-900"
					) }
					disabled={ disabled }
				>
					{ value?.value
						? (
							format(value?.value, "PPP", {locale: dateFnsLocale})
						)
						: <span>{ defaultPlaceholder }</span> }
					<ChevronDownIcon className="h-4 w-4 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={ value?.value }
					onSelect={ (date) =>
					{
						if (date)
						{
							const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
							onChange?.(local);
							if (value?.value)
							{
								value.value = local;
							}
						}
						else
						{
							onChange?.(undefined);
							if (value?.value)
							{
								value.value = undefined;
							}
						}
						isOpen.value = false;
					} }
					locale={ dateFnsLocale }
					captionLayout="dropdown"
					disabled={ disabledDays }
					startMonth={ minDate || new Date(startYear, 0) }
					endMonth={ maxDate || new Date(endYear, 11) }
				/>
			</PopoverContent>
		</Popover>
	);
}