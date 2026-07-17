import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ProfitAndLossReportTable } from "@/features/reports/profitAndLoss/profitAndLossReportTable.tsx";
import { ProfitAndLossReportSummary } from "@/features/reports/profitAndLoss/profitAndLossReportSummary.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ProfitAndLossRowDocumentType } from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";
import { useTranslation } from "react-i18next";


interface ProfitAndLossReportProps
{
	isPortal?: boolean;
}

export function ProfitAndLossReport({isPortal = false}: ProfitAndLossReportProps)
{
	useSignals();

	const {t} = useTranslation("accounting");
	const data = Cubits.ProfitAndLossReport.result.value;

	const getMovementTypeLabels = (types: ProfitAndLossRowDocumentType[]) =>
	{
		const labels: string[] = [];
		types.forEach(type =>
		{
			if (type === ProfitAndLossRowDocumentType.Sell) labels.push(t("invoices.sellInvoice"));
			if (type === ProfitAndLossRowDocumentType.SellReturn) labels.push(t("invoices.sellReturn"));
			if (type === ProfitAndLossRowDocumentType.Payment) labels.push(t("vouchers.paymentVoucher"));
		});
		return labels.join(" , ");
	};

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="تقرير الأرباح والخسائر" titleEn="PROFIT AND LOSS"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (data.fromDate || data.toDate) && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					{ data.fromDate && <ReportField labelAr="من التاريخ" labelEn="From date" value={ data.fromDate }/> }
					{ data.toDate && <ReportField labelAr="إلى التاريخ" labelEn="To date" value={ data.toDate }/> }
				</div>
			) }

			{ data && (data.fromAccountId || data.toAccountId) && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					<ReportField
						labelAr="من الحساب"
						labelEn="From account"
						value={ `#${ data.fromAccountId } - ${ data.fromAccountName }` }
					/>
					<ReportField
						labelAr="إلى الحساب"
						labelEn="To account"
						value={ `#${ data.toAccountId } - ${ data.toAccountName }` }
					/>
				</div>
			) }

			{ data?.documentTypes && data.documentTypes.length > 0 && (
				<div className="col-span-2 md:col-span-3 my-4">
					<ReportField
						labelAr="أنواع الحركات"
						labelEn="Movement types"
						value={ getMovementTypeLabels(data.documentTypes) }
					/>
				</div>
			) }

			{ data?.voucherCategoryNames && data.voucherCategoryNames.length > 0 && (
				<div className="col-span-2 md:col-span-3 my-4">
					<ReportField
						labelAr="فئات السندات"
						labelEn="Voucher categories"
						value={ data.voucherCategoryNames.map(name => `${ name }`).join(" , ") }
					/>
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<ProfitAndLossReportTable/>
					<ProfitAndLossReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}