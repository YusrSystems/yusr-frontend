import { formatNumber } from "@/features/report/utils/formating";
import {
	type CommercialReportResult,
	isPurchaseInvoiceReport,
	isQuotationReport,
	isSalesInvoiceReport
} from "./invoiceReportResult";
import { Services } from "@/core/services/services";
import type { ICommercialDocumentDto } from "@/core/data/commercial/commercialDocument";


export function ThermalInvoiceReport({data, isPortal}: { data: CommercialReportResult; isPortal: boolean })
{
	const {partner} = data;
	const setting = Services.auth.setting;

	const isPurchase = isPurchaseInvoiceReport(data);
	const isQuote = isQuotationReport(data);
	const isSales = isSalesInvoiceReport(data);

	const doc: ICommercialDocumentDto = isQuote ? data.quotation : data.invoice;
	const qrBytes = isSales ? data.qrBytes : undefined;
	const isInvoice = "paidAmount" in data;

	const partnerLabelAr = isPurchase ? "المورد" : "العميل";
	const defaultPartnerName = isPurchase ? "مورد نقدي" : "عميل نقدي";

	return (
		<div
			className="thermal-report text-black bg-white text-[12px] leading-snug font-sans mx-auto max-w-[80mm] p-2 pb-8">
			<style>{ `
                @media print {
                    @page {
                        margin: 0;
                        size: 80mm auto;
                    }
                    html, body {
                        background-color: white !important;
                        color: black !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .thermal-report {
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 2mm 4mm !important;
                        margin: 0 !important;
                    }
                    ${ isPortal ? `
                    body > *:not(.report-print-root) {
                        display: none !important;
                    }
                    body > .report-print-root {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    ` : "" }
                }
                .thermal-report * {
                    border-color: black !important;
                    color: black !important;
                }
            ` }</style>

			<div className="flex flex-col items-center text-center gap-1 mb-3 border-b border-dashed border-black pb-3">
				{ setting?.logo.value?.url && (
					<img
						src={ setting.logo.value.url }
						alt="Logo"
						className="w-16 h-16 object-contain mb-1"
						style={ {filter: "grayscale(100%) contrast(1000%)"} }
					/>
				) }
				<h2 className="font-bold text-lg">{ setting?.companyName.value }</h2>
				{ setting?.vatNumber.value && <p>الرقم الضريبي: { setting.vatNumber.value }</p> }
				{ setting?.branch.value && (
					<p>
						{ setting.branch.value.cityName.value } - { setting.branch.value.district.value }
					</p>
				) }
				{ setting?.companyPhone.value && <p>{ setting.companyPhone.value }</p> }
			</div>

			<div className="flex flex-col items-center text-center gap-1 mb-3">
				<h3 className="font-bold text-base">{ data.titleAr }</h3>
				<h3 className="font-bold text-sm">{ data.titleEn }</h3>
				<p className="mt-1 font-bold">رقم المستند: { doc.id }</p>
				<p>التاريخ: { doc.date }</p>
			</div>

			<div className="mb-3 border-b border-dashed border-black pb-3">
				<p>
					<span className="font-bold">المستودع:</span> { doc.storeName }
				</p>
				<p>
					<span className="font-bold">{ partnerLabelAr }:</span> { partner.name || defaultPartnerName }
				</p>
				{ partner.vatNumber && (
					<p>
						<span className="font-bold">الرقم الضريبي:</span> { partner.vatNumber }
					</p>
				) }
			</div>

			<table className="w-full mb-3 text-right">
				<thead>
				<tr className="border-b border-black border-dashed">
					<th className="py-1 font-bold">الصنف</th>
					<th className="py-1 font-bold text-center">الكمية</th>
					<th className="py-1 font-bold">السعر</th>
					<th className="py-1 font-bold">المجموع</th>
				</tr>
				</thead>
				<tbody>
				{ doc.items.map((item, idx) => (
					<tr key={ item.id || idx } className="border-b border-black border-dashed last:border-b-0">
						<td className="py-2">
							<div className="font-bold">{ item.itemName }</div>
							<div className="text-[10px]">{ item.unitName }</div>
						</td>
						<td className="py-2 text-center font-bold">{ formatNumber(item.quantity) }</td>
						<td className="py-2">{ formatNumber(item.taxInclusivePrice) }</td>
						<td className="py-2 font-bold">{ formatNumber(item.taxInclusiveTotalPrice) }</td>
					</tr>
				)) }
				</tbody>
			</table>

			<div className="flex flex-col gap-1 mb-3 border-t border-b border-dashed border-black py-3">
				{ data.settlementAmount > 0 && (
					<div className="flex justify-between">
						<span>مبلغ التسوية:</span>
						<span>{ formatNumber(data.settlementAmount) }</span>
					</div>
				) }
				<div className="flex justify-between">
					<span>الإجمالي قبل الضريبة:</span>
					<span>{ formatNumber(data.totalBeforeTax) }</span>
				</div>
				<div className="flex justify-between">
					<span>قيمة الضريبة:</span>
					<span>{ formatNumber(data.totalTaxAmount) }</span>
				</div>
				<div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-black">
					<span>الإجمالي بعد الضريبة:</span>
					<span>{ formatNumber(data.totalAfterTax) }</span>
				</div>
			</div>

			{ isInvoice && (
				<div className="flex flex-col gap-1 mb-4 border-b border-dashed border-black pb-3">
					{ isSales && data.tenderedAmount !== undefined && data.tenderedAmount !== null ? (
						<>
							<div className="flex justify-between font-bold">
								<span>المبلغ المستلم:</span>
								<span>{ formatNumber(data.tenderedAmount) }</span>
							</div>
							<div className="flex justify-between font-bold">
								<span>الباقي للعميل:</span>
								<span>{ formatNumber(data.changeAmount || 0) }</span>
							</div>
						</>
					) : (
						<>
							<div className="flex justify-between font-bold">
								<span>المدفوع:</span>
								<span>{ formatNumber((data as { paidAmount: number }).paidAmount) }</span>
							</div>
							<div className="flex justify-between font-bold">
								<span>المتبقي:</span>
								<span>{ formatNumber((data as { remainingAmount: number }).remainingAmount) }</span>
							</div>
						</>
					) }
				</div>
			) }

			{ qrBytes && (
				<div className="flex justify-center mb-4">
					<img
						src={ `data:image/png;base64,${ qrBytes }` }
						alt="QR Code"
						className="w-36 h-36 object-contain"
					/>
				</div>
			) }

			{ doc.policy && (
				<div className="text-center text-[11px] font-bold whitespace-pre-wrap mt-4">
					{ doc.policy }
				</div>
			) }
		</div>
	);
}