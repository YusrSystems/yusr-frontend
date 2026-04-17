import { useState } from "react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { Calendar } from "../../pure/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../pure/popover";

export interface DateInputProps {
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

export function DateInput({
  value,
  onChange,
  isInvalid,
  placeholder = "اختر تاريخا",
  locale = arSA,
  startYear = new Date().getFullYear() - 100,
  endYear = new Date().getFullYear() + 10,
  minDate,
  maxDate,
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const disabledDays = [];
  if (minDate) disabledDays.push({ before: minDate });
  if (maxDate) disabledDays.push({ after: maxDate });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground",
            isInvalid && "border-red-600 ring-red-600 text-red-900",
          )}
        >
          {value ? (
            format(value, "PPP", { locale })
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setIsOpen(false);
          }}
          locale={locale}
          captionLayout="dropdown"
          disabled={disabledDays}
          startMonth={minDate || new Date(startYear, 0)}
          endMonth={maxDate || new Date(endYear, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}