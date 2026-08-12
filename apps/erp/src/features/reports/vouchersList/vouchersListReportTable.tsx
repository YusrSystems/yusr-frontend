import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { PageError, PageLoaded, PageLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VoucherType } from "@/core/data/voucher.ts";
import { getTransactionStatusName } from "#/types/transactionStatus.ts";


export function VouchersListReportTable()
{
	useSignals();
	const {t} = useTranslation("accounting");

	if (Cubits.vouchers.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}
	if (Cubits.vouchers.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}
	if (Cubits.vouchers.state.value instanceof PageLoaded)
	{
		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="رقم السند" en="Voucher id"/>
					<ReportTableTh ar="الحالة" en="Status"/>
					<ReportTableTh ar="نوع السند" en="Voucher type"/>
					<ReportTableTh ar="تاريخ السند" en="Date"/>
					<ReportTableTh ar="الجهة / الحساب" en="Party / Account"/>
					<ReportTableTh ar="المبلغ" en="Amount"/>
					<ReportTableTh ar="طريقة الدفع" en="Payment method"/>
				</tr>
				</thead>
				<tbody>
				{ Cubits.vouchers.entities.value.map((voucher, idx) =>
				{
					const isEven = idx % 2 === 0;
					const isPayment = voucher.type === VoucherType.Payment;
					return (
						<tr key={ voucher.id }>
							<ReportTableTd isEven={ isEven }>
								{ idx + 1 + ((Cubits.vouchers.currentPage.value - 1) * Cubits.vouchers.pageSize.value) }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className="p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!"
							>
								<Link
									to={ `/vouchers/${ voucher.id }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									{ voucher.id }
								</Link>
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>
								{ getTransactionStatusName(voucher.transactionStatus) }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ isPayment ? "text-red-600! font-semibold" : "text-green-600! font-semibold" }
							>
								{ isPayment ? t("vouchers.paymentVoucher") : t("vouchers.receiptVoucher") }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ String(voucher.date).split("T")[0] }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">
								{ voucher.partnerName || voucher.glAccountName || "-" }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="font-bold font-mono">
								{ formatNumber(voucher.amount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>
								{ voucher.paymentMethod?.name ?? "-" }
							</ReportTableTd>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}
	return <TablePreview.Empty/>;
}