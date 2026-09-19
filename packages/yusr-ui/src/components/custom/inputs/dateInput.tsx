import { ar, enUS } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "#/utils/cn.ts";
import { Button } from "../../pure/button";
import { Calendar, Popover, PopoverContent, PopoverTrigger } from "#/components/pure";
import { type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { DateService } from "#/services";


export interface DateInputProps
{
	value?: Signal<string | undefined>;
	onChange?: (date: string | undefined) => void;
	placeholder?: string;
	locale?: unknown;
	startYear?: number;
	endYear?: number;
	minDate?: Date;
	maxDate?: Date;
	disabled?: boolean;
}

function assignSignalValue(signal?: Signal<string | undefined>, nextValue?: string)
{
	if (signal)
	{
		signal.value = nextValue;
	}
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
	const [isOpen, setIsOpen] = useState(false);

	// Force Gregorian calendar on Arabic locale
	const arGregorian = useMemo(() => ({
		...ar,
		code: "ar-u-ca-gregory"
	}), []);

	const {t, i18n} = useTranslation("common");
	const defaultPlaceholder = placeholder || t("dateInput.placeholder");
	const dateFnsLocale = locale ?? (i18n.language === "ar" ? arGregorian : enUS);

	const disabledDays = [];
	if (minDate)
	{
		disabledDays.push({before: minDate});
	}
	if (maxDate)
	{
		disabledDays.push({after: maxDate});
	}

	const selectedDate = value?.value ? DateService.parseDateOnly(value.value) : undefined;

	return (
		<Popover open={ isOpen } onOpenChange={ setIsOpen }>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={ cn(
						"w-full justify-between text-left font-normal",
						!value && "text-muted-foreground"
					) }
					disabled={ disabled }
				>
					{ value?.value ? value?.value : <span>{ defaultPlaceholder }</span> }
					<ChevronDownIcon className="h-4 w-4 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={ selectedDate }
					onSelect={ (date) =>
					{
						if (date)
						{
							const formatted = DateService.formatDateOnly(date);
							onChange?.(formatted);
							assignSignalValue(value, formatted);
						}
						else
						{
							onChange?.(undefined);
							assignSignalValue(value, undefined);
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