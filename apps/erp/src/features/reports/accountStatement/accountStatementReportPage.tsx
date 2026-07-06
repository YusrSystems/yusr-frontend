import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading, Tabs, TabsList, TabsTrigger } from "yusr-ui";
import { FileText, List } from "lucide-react";
import ReportPage from "@/features/report/reportPage.tsx";
import { AccountStatementReportFields } from "@/features/reports/accountStatement/accountStatementReportFields.tsx";
import { AccountStatementReport } from "@/features/reports/accountStatement/accountStatementReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { AccountStatementReportRequest } from "@/features/reports/accountStatement/accountStatementReportRequest.ts";


export function AccountStatementReportPage()
{
	useSignals();

	const {accountId, accountName} = useParams<{ accountId?: string, accountName?: string }>();

	const lastRequest = useMemo(() => signal<AccountStatementReportRequest | undefined>(undefined), []);
	const isGrouped = useMemo(() => signal<boolean>(true), []);

	useEffect(() =>
	{
		const parsedAccountId = accountId ? Number(accountId) : undefined;
		if (parsedAccountId && !Number.isNaN(parsedAccountId))
		{
			const request = new AccountStatementReportRequest({
				accountId: parsedAccountId,
				groupByDocument: isGrouped.value
			});
			lastRequest.value = request;
			void Cubits.AccountStatementReport.getReportData(request, 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accountId]);

	const handleTabChange = (value: string) =>
	{
		const pressedValue = value === "grouped";
		isGrouped.value = pressedValue;

		if (lastRequest.value)
		{
			const updatedRequest = new AccountStatementReportRequest({
				...lastRequest.value,
				groupByDocument: pressedValue
			});
			lastRequest.value = updatedRequest;
			void Cubits.AccountStatementReport.getReportData(updatedRequest, 1);
		}
	};

	const handleSubmit = (request: AccountStatementReportRequest) =>
	{
		request.groupByDocument = isGrouped.value;
		lastRequest.value = request;
		void Cubits.AccountStatementReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!lastRequest.value) return;
		void Cubits.AccountStatementReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.AccountStatementReport.state.value instanceof ReportLoading;
	const data = Cubits.AccountStatementReport.result.value;

	return (
		<ReportPage>
			<div className="print:hidden w-full shrink-0 flex flex-col gap-3 mb-2">

				<Tabs
					value={ isGrouped.value ? "grouped" : "itemized" }
					onValueChange={ handleTabChange }
					className="w-full max-w-md self-start"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="itemized" className="flex items-center gap-2">
							<span>كشف تفصيلي (حركة بحركة)</span>
							<List className="w-4 h-4"/>
						</TabsTrigger>
						<TabsTrigger value="grouped" className="flex items-center gap-2">
							<span>تجميع حسب المستند</span>
							<FileText className="w-4 h-4"/>
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<AccountStatementReportFields
					onSubmit={ handleSubmit }
					isLoading={ isLoading }
					initialAccountId={ accountId ? Number(accountId) : undefined }
					initialAccountName={ accountName }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<AccountStatementReport/>
			</div>

			{ data && data.totalCount > 0 && (
				<CrudTablePagination
					className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
					pageSize={ data.rowsPerPage }
					totalNumber={ data.totalCount }
					currentPage={ data.pageNumber }
					onPageChanged={ handlePageChanged }
				/>
			) }
		</ReportPage>
	);
}