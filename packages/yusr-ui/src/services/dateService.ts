export class DateService
{
	public static parseDateOnly(value: string): Date
	{
		const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

		if (!match)
		{
			throw new Error(`Invalid date-only string: "${ value }"`);
		}

		const [, year, month, day] = match;
		return new Date(Number(year), Number(month) - 1, Number(day));
	}

	public static stripTime(date: Date): Date
	{
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	public static formatDateOnly(date: Date): string
	{
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${ year }-${ month }-${ day }`;
	}
}