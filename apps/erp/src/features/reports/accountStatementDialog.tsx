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
import type { Account } from "../../core/data/account";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { AccountStatementReportRequest } from "@/core/data/report/accountStatementReportRequest.ts";


export function AccountStatementButton({account}: { account: Account; })
{
	useSignals();
	const {t, i18n} = useTranslation("erpCommon");
	const isOpen = useMemo(() => signal(false), []);
	const fromDate = useMemo(() => signal<string>(), []);
	const toDate = useMemo(() => signal<string>(), []);

	return (
		<>
			<Button variant="outline" size="sm" className="cursor-pointer" onClick={ () => isOpen.value = true }>
				{ t("accountStatement.button") }
			</Button>

			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("accountStatement.title") }</DialogTitle>
						<DialogDescription>{ account.name.value }</DialogDescription>
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
							reportName={ ReportConstants.AccountStatement }
							request={ new AccountStatementReportRequest({
								accountId: account.id.value,
								fromDate: fromDate.value || null,
								toDate: toDate.value || null
							}) }
						>
						</ReportButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
