import { useTranslation } from "react-i18next";
import {
	Button,
	DateField,
	DateService,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "yusr-ui";
import { InvoicesListReportRequest, InvoicesListReportType } from "@/core/data/report/invoicesListReportType.ts";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";
import { InvoiceType } from "@/core/types/invoiceType.ts";


export default function ProfitAndLossDialog()
{
	useSignals();
	const {t, i18n} = useTranslation("erpCommon");

	const isOpen = useMemo(() => signal(false), []);
	const fromDate = useMemo(() =>
	{
		const date = new Date();
		date.setMonth(date.getMonth() - 1);
		return signal<string>(DateService.formatDateOnly(date));
	}, []);
	const toDate = useMemo(() => signal<string>(DateService.formatDateOnly(new Date())), []);

	return (
		<>
			<Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
				{ t("reports.create") }
			</Button>
			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("reports.profitAndLoss") }</DialogTitle>
						<DialogDescription>{ t("reports.profitAndLossDescription") }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
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
							reportName={ ReportConstants.InvoicesList }
							request={ new InvoicesListReportRequest({
								fromDate: fromDate.value ?? undefined,
								toDate: toDate.value ?? undefined,
								reportType: InvoicesListReportType.ProfitAndLoss,
								types: [InvoiceType.Sell, InvoiceType.SellReturn, InvoiceType.Purchase, InvoiceType.PurchaseReturn]
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
