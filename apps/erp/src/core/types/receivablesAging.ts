export enum ReceivablesAgingViewMode
{
	Summary = 1,
	Detailed = 2
}

export enum ReceivablesAgingBucket
{
	All = 0,
	Current = 1,
	Days1To30 = 2,
	Days31To60 = 3,
	Days61To90 = 4,
	Days90Plus = 5
}

export function getReceivablesAgingBucketName(bucket: ReceivablesAgingBucket): string
{
	switch (bucket)
	{
		case ReceivablesAgingBucket.Current:
			return "حالي (غير مستحق)";
		case ReceivablesAgingBucket.Days1To30:
			return "1 - 30 يوم";
		case ReceivablesAgingBucket.Days31To60:
			return "31 - 60 يوم";
		case ReceivablesAgingBucket.Days61To90:
			return "61 - 90 يوم";
		case ReceivablesAgingBucket.Days90Plus:
			return "+90 يوم";
		default:
			return "الكل";
	}
}

export function getReceivablesAgingBucketBadge(bucket: ReceivablesAgingBucket): {
	label: string;
	className: string;
}
{
	switch (bucket)
	{
		case ReceivablesAgingBucket.Current:
			return {
				label: "حالي",
				className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
			};
		case ReceivablesAgingBucket.Days1To30:
			return {
				label: "1 - 30 يوم",
				className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800"
			};
		case ReceivablesAgingBucket.Days31To60:
			return {
				label: "31 - 60 يوم",
				className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
			};
		case ReceivablesAgingBucket.Days61To90:
			return {
				label: "61 - 90 يوم",
				className: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800"
			};
		case ReceivablesAgingBucket.Days90Plus:
			return {
				label: "+90 يوم",
				className: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold"
			};
		default:
			return {
				label: "الكل",
				className: "bg-muted text-muted-foreground"
			};
	}
}