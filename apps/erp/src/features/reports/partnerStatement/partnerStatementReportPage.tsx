import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { PartnerStatementReportFields } from "@/features/reports/partnerStatement/partnerStatementReportFields.tsx";
import { PartnerStatementReport } from "@/features/reports/partnerStatement/partnerStatementReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { PartnerStatementReportRequest } from "@/features/reports/partnerStatement/partnerStatementReportRequest.ts";
import { type PartnerStatementLine } from "@/features/reports/partnerStatement/partnerStatementReportResult.ts";
import { getDocumentTypeName } from "@/core/types/documentType.ts";
import { APP_NAME } from "../../../../appConfig.ts";
import { PartnerType } from "@/core/data/partner.ts";


export function PartnerStatementReportPage()
{
	useSignals();

	const {partnerId, partnerName} = useParams<{ partnerId?: string; partnerName?: string }>();

	const lastRequest = useMemo(() => signal<PartnerStatementReportRequest | undefined>(undefined), []);

	useEffect(() =>
	{
		const parsedPartnerId = partnerId ? Number(partnerId) : undefined;
		if (parsedPartnerId && !Number.isNaN(parsedPartnerId))
		{
			const request = new PartnerStatementReportRequest({
				partnerId: parsedPartnerId
			});
			lastRequest.value = request;
			void Cubits.PartnerStatementReport.getReportData(request, 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [partnerId]);

	const handleSubmit = (request: PartnerStatementReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.PartnerStatementReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!lastRequest.value) return;
		void Cubits.PartnerStatementReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.PartnerStatementReport.state.value instanceof ReportLoading;
	const data = Cubits.PartnerStatementReport.result.value;

	useEffect(() =>
	{
		const baseTitle = data?.partner.type === PartnerType.Customer ? "كشف حساب عميل" : "كشف حساب مورد";
		const currentPartnerName = data?.partner?.name || partnerName || "محدد";

		if (data && lastRequest.value?.fromDate && lastRequest.value?.toDate)
		{
			document.title = `${ baseTitle } - ${ currentPartnerName } - من ${ lastRequest.value.fromDate } إلى ${ lastRequest.value.toDate }`;
		}
		else if (data)
		{
			document.title = `${ baseTitle } - ${ currentPartnerName }`;
		}
		else
		{
			document.title = `${ baseTitle }`;
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data, partnerName, lastRequest.value?.fromDate, lastRequest.value?.toDate]);

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<PartnerStatementLine>
					fileName={ `كشف_حساب_جهة_${ partnerName || "محدد" }` }
					getRows={ async () => Cubits.PartnerStatementReport.result.value?.lines ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "نوع المستند", accessor: (r) => getDocumentTypeName(r.documentType)},
						{header: "رقم المستند", accessor: (r) => r.documentId.toString()},
						{header: "البيان", accessor: (r) => r.description},
						{header: "مدين", accessor: (r) => r.debit.toString()},
						{header: "دائن", accessor: (r) => r.credit.toString()},
						{header: "الرصيد", accessor: (r) => r.runningBalance.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0 flex flex-col">
				<PartnerStatementReportFields
					onSubmit={ handleSubmit }
					isLoading={ isLoading }
					initialPartnerId={ partnerId ? Number(partnerId) : undefined }
					initialPartnerName={ partnerName }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<PartnerStatementReport/>
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