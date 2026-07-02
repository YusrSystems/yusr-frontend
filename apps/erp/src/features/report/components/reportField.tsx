interface ReportFieldProps
{
	labelAr: string;
	labelEn: string;
	value?: string;
}

export function ReportField({labelAr, labelEn, value}: ReportFieldProps)
{
	return (
		<div className="flex flex-col gap-1.5 flex-1 w-full">
			<div
				className="flex justify-between items-center px-1 select-none text-xs font-bold font-sans text-muted-foreground tracking-wider uppercase">

				<span>
					{ labelAr }
				</span>

				<span dir="ltr">
					{ labelEn }
				</span>
			</div>

			<div
				className="flex h-8 w-full rounded-lg border border-input bg-transparent text-xs justify-center shadow-xs transition-colors items-center">
				<span>
					{ value }
				</span>
			</div>
		</div>
	);
}