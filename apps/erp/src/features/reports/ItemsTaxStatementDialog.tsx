import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    DateField,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    FormFieldOld,
    SelectField
} from "yusr-ui";
import {
    ItemsTaxStatementReportRequest,
    ItemsTaxStatementReportType
} from "@/core/data/report/itemsTaxStatementReportRequest.ts";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect.tsx";


export default function ItemsTaxStatementDialog()
{
	useSignals();
	const {t, i18n} = useTranslation("erpCommon");

	const isOpen = useMemo(() => signal(false), []);
	const fromDate = useMemo(() => signal<Date>(), []);
	const itemId = useMemo(() => signal<number>(), []);
	const itemName = useMemo(() => signal<string>(), []);
	const toDate = useMemo(() => signal<Date>(), []);
	const type = useMemo(() => signal<ItemsTaxStatementReportType>(ItemsTaxStatementReportType.Sales), []);

	return (
		<>
			<Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
				{ t("reports.create") }
			</Button>
			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("reports.itemsTaxStatement") }</DialogTitle>
						<DialogDescription>{ t("reports.itemsTaxStatementDescription") }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<SelectField
							label={ t("reports.invoiceType") }
							required
							value={ type }
							options={ [{
								label: t("reports.salesTaxReport"),
								value: ItemsTaxStatementReportType.Sales
							}, {
								label: t("reports.purchasesTaxReport"),
								value: ItemsTaxStatementReportType.Purchases
							}] }
						/>
						<FormFieldOld label={ t("reports.item") } required={ true }>
							<ItemsSearchableSelect
								id={ itemId }
								label={ itemName }
							/>
						</FormFieldOld>
						<DateField
							label={ t("reports.fromDate") }
							value={ fromDate }
						/>
						<DateField
							label={ t("reports.toDate") }
							value={ toDate }
						/>
					</div>

					<DialogFooter>
						<ReportButton
							reportName={ ReportConstants.ItemTaxStatement }
							request={ new ItemsTaxStatementReportRequest({
								fromDate: fromDate.value?.toLocaleDateString("en-CA"),
								toDate: toDate.value?.toLocaleDateString("en-CA"),
								itemId: itemId.value,
								type: type.value
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
