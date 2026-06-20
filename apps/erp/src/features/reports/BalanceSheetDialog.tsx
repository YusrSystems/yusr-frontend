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
	DialogTitle
} from "yusr-ui";
import { BalanceSheetReportRequest } from "../../core/data/report/balanceSheetReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";


export default function BalanceSheetDialog()
{
	useSignals();
	const {t, i18n} = useTranslation("erpCommon");
	const isOpen = useMemo(() => signal(false), []);
	const toDate = useMemo(() => signal<Date>(new Date()), []);

	return (
		<>
			<Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
				{ t("reports.create") }
			</Button>
			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("reports.balanceSheet") }</DialogTitle>
						<DialogDescription>{ t("reports.balanceSheetDescription") }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<DateField
							label={ t("reports.toDate") }
							value={ toDate }
						/>
					</div>

					<DialogFooter>
						<ReportButton
							reportName={ ReportConstants.BalanceSheet }
							request={ new BalanceSheetReportRequest({
								toDate: toDate.value?.toLocaleDateString("en-CA") ?? undefined
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
