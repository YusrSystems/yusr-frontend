import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DateField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { BalanceSheetReportRequest } from "@/features/reports/balanceSheet/balanceSheetReportRequest.ts";


interface BalanceSheetReportFieldsProps
{
	onSubmit: (request: BalanceSheetReportRequest) => void;
	isLoading?: boolean;
}

export function BalanceSheetReportFields({onSubmit, isLoading = false}: BalanceSheetReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const defaults = useMemo(() => new BalanceSheetReportRequest(), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const toDate = useMemo(() => signal<string>(defaults.toDate), []);

	const handleClear = () =>
	{
		toDate.value = defaults.toDate;
		onSubmit(new BalanceSheetReportRequest({toDate: defaults.toDate}));
	};

	return (
		<Collapsible
			open={ isOpen.value }
			onOpenChange={ (open) => isOpen.value = open }
			className="bg-card border border-border rounded-t-lg"
		>
			<CollapsibleTrigger asChild>
				<button
					type="button"
					className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted"
				>
					<span className="flex items-center gap-2">
						<Filter className="h-4 w-4"/>
						{ t("common:filter.title") }
					</span>
					<ChevronDown
						className={ `h-4 w-4 transition-transform duration-200 ${ isOpen.value ? "rotate-180" : "" }` }
					/>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-4 p-4 border-t border-border">
					<DateField label={ t("reports.toDate") } value={ toDate }/>

					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							{ t("common:filter.clear") }
						</Button>
						<Button
							disabled={ isLoading }
							onClick={ () => onSubmit(new BalanceSheetReportRequest({
								toDate: toDate.value ?? defaults.toDate
							})) }
						>
							{ t("common:filter.apply") }
						</Button>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}