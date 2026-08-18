import { FiscalYearStatus } from "@/core/data/fiscalYear";


interface FiscalYearStatusBadgeProps
{
	status: FiscalYearStatus;
}

export function FiscalYearStatusBadge({status}: FiscalYearStatusBadgeProps)
{
	switch (status)
	{
		case FiscalYearStatus.Open:
			return (
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
					مفتوحة
				</span>
			);
		case FiscalYearStatus.Locked:
			return (
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
					مجمّدة
				</span>
			);
		case FiscalYearStatus.Closed:
			return (
				<span
					className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
					مقفلة
				</span>
			);
		default:
			return null;
	}
}