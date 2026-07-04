import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DateField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { TaxReturnReportRequest } from "@/features/reports/taxReturn/taxReturnReportRequest.ts";


interface TaxReturnReportFieldsProps
{
	onSubmit: (request: TaxReturnReportRequest) => void;
	isLoading?: boolean;
}

export function TaxReturnReportFields({onSubmit, isLoading = false}: TaxReturnReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const defaultRequest = useMemo(() => new TaxReturnReportRequest(), []);
	const fromDate = useMemo(() => signal<string>(defaultRequest.fromDate), [defaultRequest.fromDate]);
	const toDate = useMemo(() => signal<string>(defaultRequest.toDate), [defaultRequest.toDate]);

	const handleClear = () =>
	{
		const freshRequest = new TaxReturnReportRequest();
		fromDate.value = freshRequest.fromDate;
		toDate.value = freshRequest.toDate;
		onSubmit(freshRequest);
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
					<div className="grid grid-cols-2 gap-3">
						<DateField label={ t("reports.fromDate") } value={ fromDate }/>
						<DateField label={ t("reports.toDate") } value={ toDate }/>
					</div>

					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							{ t("common:filter.clear") }
						</Button>
						<Button
							disabled={ isLoading }
							onClick={ () => onSubmit(new TaxReturnReportRequest({
								fromDate: fromDate.value ?? undefined,
								toDate: toDate.value ?? undefined
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