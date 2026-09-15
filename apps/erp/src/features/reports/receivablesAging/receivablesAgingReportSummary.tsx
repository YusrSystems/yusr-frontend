import { Card } from "yusr-ui";
import { formatNumber } from "@/features/report/utils/formating";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { useSignals } from "@preact/signals-react/runtime";
import type { ReceivablesAgingReportResult } from "./receivablesAgingReportResult";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, ShieldAlert, Wallet } from "lucide-react";


interface ReceivablesAgingReportSummaryProps
{
	data: ReceivablesAgingReportResult;
}

export function ReceivablesAgingReportSummary({data}: ReceivablesAgingReportSummaryProps)
{
	useSignals();

	const cards = [
		{
			label: "إجمالي الذمم",
			amount: data.grandTotalOutstanding,
			textClass: "text-foreground font-black",
			cardClass: "bg-muted/40 border-border/80",
			icon: <Wallet className="w-4 h-4 text-muted-foreground"/>
		},
		{
			label: "حالي (غير مستحق)",
			amount: data.totalCurrent,
			textClass: data.totalCurrent > 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-foreground",
			cardClass: "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 dark:border-emerald-900/40",
			icon: <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400"/>
		},
		{
			label: "1 - 30 يوم",
			amount: data.totalDays1To30,
			textClass: data.totalDays1To30 > 0 ? "text-blue-600 dark:text-blue-400 font-bold" : "text-foreground",
			cardClass: "bg-blue-500/5 dark:bg-blue-950/20 border-blue-500/20 dark:border-blue-900/40",
			icon: <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
		},
		{
			label: "31 - 60 يوم",
			amount: data.totalDays31To60,
			textClass: data.totalDays31To60 > 0 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-foreground",
			cardClass: "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/20 dark:border-amber-900/40",
			icon: <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400"/>
		},
		{
			label: "61 - 90 يوم",
			amount: data.totalDays61To90,
			textClass: data.totalDays61To90 > 0 ? "text-orange-600 dark:text-orange-400 font-bold" : "text-foreground",
			cardClass: "bg-orange-500/5 dark:bg-orange-950/20 border-orange-500/20 dark:border-orange-900/40",
			icon: <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400"/>
		},
		{
			label: "+90 يوم",
			amount: data.totalDays90Plus,
			textClass: data.totalDays90Plus > 0 ? "text-rose-600 dark:text-rose-400 font-black" : "text-foreground",
			cardClass: "bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/20 dark:border-rose-900/40",
			icon: <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400"/>
		}
	];

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-6 print:break-inside-avoid">
			{ cards.map((card, idx) => (
				<Card
					key={ idx }
					className={ `border p-3.5 rounded-xl shadow-2xs flex flex-col justify-between gap-3 transition-colors ${ card.cardClass }` }
				>
					<div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
						<span>{ card.label }</span>
						<span className="shrink-0">{ card.icon }</span>
					</div>
					<div className={ `text-base tabular-nums flex items-center gap-1 ${ card.textClass }` }>
						{ formatNumber(card.amount) }
						<ErpCurrencyIcon className="w-3.5 h-3.5 text-muted-foreground/70"/>
					</div>
				</Card>
			)) }
		</div>
	);
}