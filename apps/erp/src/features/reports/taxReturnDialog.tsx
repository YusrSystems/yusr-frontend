import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DateField,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "yusr-ui";
import ReportConstants from "../../core/data/report/reportConstants";
import { TaxReturnReportRequest } from "@/core/data/report/taxReturnReportRequest.ts";
import ReportButton from "./reportButton";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


export default function TaxReturnDialog()
{
	useSignals();
	const {t, i18n} = useTranslation("erpCommon");

	const isOpen = useMemo(() => signal(false), []);
	const fromDate = useMemo(() => signal<Date>(new Date()), []);
	const toDate = useMemo(() => signal<Date>(new Date()), []);

	useEffect(() =>
	{
		fromDate.value.setMonth(fromDate.value.getMonth() - 1);
	}, [fromDate.value]);

	return (
		<>
			<Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
				{ t("reports.create") }
			</Button>
			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("reports.taxReturn") }</DialogTitle>
						<DialogDescription>{ t("reports.taxReturnDescription") }</DialogDescription>
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
							reportName={ ReportConstants.TaxReturn }
							request={ new TaxReturnReportRequest({
								fromDate: fromDate.value.toLocaleDateString("en-CA"),
								toDate: toDate.value.toLocaleDateString("en-CA")
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
