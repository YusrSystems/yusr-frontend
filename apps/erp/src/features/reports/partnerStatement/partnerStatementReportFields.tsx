import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DateField, FormField } from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import PartnersSearchableSelect from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import { PartnerStatementReportRequest } from "@/features/reports/partnerStatement/partnerStatementReportRequest.ts";


interface PartnerStatementReportFieldsProps
{
	onSubmit: (request: PartnerStatementReportRequest) => void;
	isLoading?: boolean;
	initialPartnerId?: number;
	initialPartnerName?: string;
}

export function PartnerStatementReportFields({
	onSubmit,
	initialPartnerId,
	initialPartnerName,
	isLoading = false
}: PartnerStatementReportFieldsProps)
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "common"]);

	const isOpen = useMemo(() => signal(true), []);
	const partnerId = useMemo(() => signal<number | undefined>(initialPartnerId), [initialPartnerId]);
	const partnerName = useMemo(() => signal<string | undefined>(initialPartnerName), [initialPartnerName]);
	const defaults = useMemo(() => new PartnerStatementReportRequest(), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fromDate = useMemo(() => signal<string>(defaults.fromDate), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const toDate = useMemo(() => signal<string>(defaults.toDate), []);

	const handleClear = () =>
	{
		fromDate.value = defaults.fromDate;
		toDate.value = defaults.toDate;
		partnerId.value = undefined;
		partnerName.value = undefined;
	};

	return (
		<Collapsible
			open={ isOpen.value }
			onOpenChange={ (open) => (isOpen.value = open) }
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<FormField label={ t("reports.partner", "الجهة") }>
							<PartnersSearchableSelect id={ partnerId } label={ partnerName }/>
						</FormField>

						<DateField label={ t("reports.fromDate", "من تاريخ") } value={ fromDate }/>

						<DateField label={ t("reports.toDate", "إلى تاريخ") } value={ toDate }/>
					</div>

					<div className="flex justify-end gap-2">
						<Button disabled={ isLoading } variant="outline" onClick={ handleClear }>
							{ t("common:filter.clear") }
						</Button>
						<Button
							disabled={ isLoading || !partnerId.value }
							onClick={ () =>
								onSubmit(
									new PartnerStatementReportRequest({
										partnerId: partnerId.value!,
										fromDate: fromDate.value,
										toDate: toDate.value
									})
								)
							}
						>
							{ t("common:filter.apply") }
						</Button>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}