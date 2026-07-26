import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { AccountStatementReportFields } from "@/features/reports/accountStatement/accountStatementReportFields.tsx";
import { AccountStatementReport } from "@/features/reports/accountStatement/accountStatementReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { AccountStatementReportRequest } from "@/features/reports/accountStatement/accountStatementReportRequest.ts";
import { type AccountStatementLine } from "@/features/reports/accountStatement/accountStatementReportResult.ts";
import { getDocumentTypeName } from "@/core/types/documentType.ts";
import { APP_NAME } from "../../../../appConfig.ts";


export function AccountStatementReportPage()
{
	useSignals();

	const {accountId, accountName} = useParams<{ accountId?: string, accountName?: string }>();

	const lastRequest = useMemo(() => signal<AccountStatementReportRequest | undefined>(undefined), []);

	useEffect(() =>
	{
		const parsedAccountId = accountId ? Number(accountId) : undefined;
		if (parsedAccountId && !Number.isNaN(parsedAccountId))
		{
			const request = new AccountStatementReportRequest({
				glAccountId: parsedAccountId
			});
			lastRequest.value = request;
			void Cubits.AccountStatementReport.getReportData(request, 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accountId]);

	const handleSubmit = (request: AccountStatementReportRequest) =>
	{
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

	useEffect(() =>
	{
		if (data?.account?.name)
		{
			document.title = `كشف حساب - ${ data.account.name }`;
		}
		else
		{
			document.title = "كشف حساب";
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data]);

	return (
		<ReportPage>

			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<AccountStatementLine>
					fileName={ `كشف_حساب_${ accountName || "محدد" }` }
					getRows={ async () => Cubits.AccountStatementReport.result.value?.lines ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "نوع المستند", accessor: (r) => getDocumentTypeName(r.documentType)},
						{header: "رقم المستند", accessor: (r) => r.documentId.toString()},
						{header: "الشريك", accessor: (r) => r.partnerName},
						{header: "البيان", accessor: (r) => r.description},
						{header: "مدين", accessor: (r) => r.debit.toString()},
						{header: "دائن", accessor: (r) => r.credit.toString()},
						{header: "الرصيد", accessor: (r) => r.runningBalance.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0 flex flex-col">
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