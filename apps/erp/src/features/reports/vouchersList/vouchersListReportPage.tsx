import ReportPage from "@/features/report/reportPage.tsx";
import { VouchersListReport } from "@/features/reports/vouchersList/vouchersListReport.tsx";
import { useEffect } from "react";
import { Cubits } from "@/core/services/cubits.ts";
import { CrudTablePagination, FilterSection, SystemPermissionsActions } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { type VoucherDto, VoucherType } from "@/core/data/voucher.ts";
import { APP_NAME } from "../../../../appConfig.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";
import { getTransactionStatusName } from "#/types/transactionStatus.ts";
import { RenderVoucherFilterInput } from "@/features/vouchers/vouchersPage.tsx";


export function VouchersListReportPage()
{
	useSignals();
	const {t} = useTranslation("accounting");

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportVoucherList, SystemPermissionsActions.Get)) return;
		Cubits.vouchers.init(undefined, undefined, 1000);
	}, []);

	useEffect(() =>
	{
		document.title = "قائمة السندات";
		return () =>
		{
			document.title = APP_NAME;
		};
	}, []);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportVoucherList }>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<VoucherDto>
					fileName="تقرير_قائمة_السندات"
					getRows={ async () => Cubits.vouchers.entities.value ?? [] }
					columns={ [
						{header: "رقم السند", accessor: (r) => r.id},
						{header: "الحالة", accessor: (r) => getTransactionStatusName(r.transactionStatus)},
						{
							header: "نوع السند",
							accessor: (r) => r.type === VoucherType.Payment ? t("vouchers.paymentVoucher") : t("vouchers.receiptVoucher")
						},
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "الجهة / الحساب", accessor: (r) => r.partnerName || r.glAccountName || "-"},
						{header: "المبلغ", accessor: (r) => r.amount.toString()},
						{header: "طريقة الدفع", accessor: (r) => r.paymentMethod?.name ?? "-"},
						{header: "البيان", accessor: (r) => r.description ?? ""}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0 flex flex-col gap-4">
				<FilterSection
					fieldsCubit={ Cubits.voucherFilterFields }
					onApply={ (groups) => Cubits.vouchers.applyFilterGroups(groups) }
					onClear={ () => Cubits.vouchers.clearFilterGroups() }
					renderCustomInput={ RenderVoucherFilterInput }
				/>
			</div>
			<div className="flex-1 min-h-0 flex flex-col print:block">
				<VouchersListReport/>
			</div>
			<CrudTablePagination
				className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
				pageSize={ Cubits.vouchers.pageSize.value }
				totalNumber={ Cubits.vouchers.count.value }
				currentPage={ Cubits.vouchers.currentPage.value }
				onPageChanged={ (newPage) =>
				{
					Cubits.vouchers.changePage(newPage);
				} }
			/>
		</ReportPage>
	);
}