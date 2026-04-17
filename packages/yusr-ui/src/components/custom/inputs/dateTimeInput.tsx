import { format, isSameDay } from "date-fns";
import { arSA } from "date-fns/locale";
import { BaseInput } from "./baseInput";
import { DateInput } from "./dateInput";

export interface DateTimeInputProps {
  value?: Date;
  onChange: (date: Date) => void;
  isInvalid?: boolean;
  locale?: any;
  minDate?: Date;
  maxDate?: Date;
}

export function DateTimeInput({
  value,
  onChange,
  isInvalid,
  locale = arSA,
  minDate,
  maxDate
}: DateTimeInputProps) {
  const dateValue = value instanceof Date ? value : undefined;

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    const dateWithTime = new Date(newDate);
    if (dateValue) {
      dateWithTime.setHours(dateValue.getHours(), dateValue.getMinutes());
    }
    onChange(dateWithTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = e.target.value;
    if (!timeVal) return;

    const [hours, minutes] = timeVal.split(":").map(Number);
    const newDate = dateValue ? new Date(dateValue) : new Date();
    newDate.setHours(hours, minutes, 0, 0);
    onChange(newDate);
  };

  let minTime: string | undefined;
  let maxTime: string | undefined;

  if (dateValue) {
    if (minDate && isSameDay(dateValue, minDate)) {
      minTime = format(minDate, "HH:mm");
    }
    if (maxDate && isSameDay(dateValue, maxDate)) {
      maxTime = format(maxDate, "HH:mm");
    }
  }

  return (
    <div className="flex gap-2 w-full">
      {/* Date Part */}
      <div className="flex-1">
        <DateInput
          value={dateValue}
          onChange={handleDateSelect}
          isInvalid={isInvalid}
          locale={locale}
          placeholder="إختر تاريخا"
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>

      {/* Time Part */}
      <div className="w-24">
        <BaseInput
          type="time"
          className="bg-background appearance-none"
          value={dateValue ? format(dateValue, "HH:mm") : ""}
          onChange={handleTimeChange}
          isInvalid={isInvalid}
          min={minTime}
          max={maxTime}
        />
      </div>
    </div>
  );
}