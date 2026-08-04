import { formatNumber } from "@/features/report/utils/formating";
import type { InvoiceReportResult } from "./invoiceReportResult";
import { Services } from "@/core/services/services";
import { InvoiceType } from "@/core/types/invoiceType";


export function ThermalInvoiceReport({data, isPortal}: { data: InvoiceReportResult, isPortal: boolean })
{
	const {invoice, partner} = data;
	const setting = Services.auth.setting;

	const isPurchase = invoice.type === InvoiceType.Purchase || invoice.type === InvoiceType.PurchaseReturn;
	const partnerLabelAr = isPurchase ? "المورد" : "العميل";
	const defaultPartnerName = isPurchase ? "مورد نقدي" : "عميل نقدي";

	return (
		<div className="thermal-report mx-auto bg-white text-black p-4 text-[12px] leading-tight"
		     style={ {width: "80mm"} }>
			<style>{ `
                @media print {
                    @page { margin: 0; size: 80mm auto; }
                    html, body { background-color: white !important; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .thermal-report { width: 100% !important; padding: 2mm !important; }
                    
                    ${ isPortal ? `
                    body > *:not(.report-print-root) {
                        display: none !important;
                    }
                    
                    body > .report-print-root {
                        display: block !important;
                    }
                    ` : "" }
                }
            ` }</style>

			<div
				className="flex flex-col items-center text-center gap-1 mb-4 border-b border-dashed border-gray-400 pb-4">
				{ setting?.logo.value?.url && (
					<img src={ setting.logo.value.url } alt="Logo" className="w-16 h-16 object-contain mb-2"/>
				) }
				<h2 className="font-bold text-lg">{ setting?.companyName.value }</h2>
				<p>الرقم الضريبي: { setting?.vatNumber.value }</p>
				<p>{ setting?.branch.value?.cityName.value } - { setting?.branch.value?.district.value }</p>
				<p>{ setting?.companyPhone.value }</p>
			</div>

			<div className="flex flex-col items-center text-center gap-1 mb-4">
				<h3 className="font-bold text-base">{ data.titleAr }</h3>
				<h3 className="font-bold text-sm">{ data.titleEn }</h3>
				<p className="mt-1">رقم الفاتورة: { invoice.id }</p>
				<p>التاريخ: { invoice.date }</p>
			</div>

			<div className="mb-4 border-b border-dashed border-gray-400 pb-4">
				<p><span className="font-bold">المستودع:</span> { invoice.storeName }</p>
				<p><span className="font-bold">{ partnerLabelAr }:</span> { partner.name || defaultPartnerName }</p>
				{ partner.vatNumber && <p><span className="font-bold">الرقم الضريبي:</span> { partner.vatNumber }</p> }
			</div>

			<table className="w-full mb-4 text-right">
				<thead>
				<tr className="border-b border-gray-400">
					<th className="py-1 font-bold">الصنف</th>
					<th className="py-1 font-bold text-center">الكمية</th>
					<th className="py-1 font-bold">السعر</th>
					<th className="py-1 font-bold">المجموع</th>
				</tr>
				</thead>
				<tbody>
				{ invoice.invoiceItems.map((item) => (
					<tr key={ item.id } className="border-b border-gray-200 border-dashed">
						<td className="py-1">
							<div>{ item.itemName }</div>
							<div className="text-[10px] text-gray-500">{ item.unitName }</div>
						</td>
						<td className="py-1 text-center">{ formatNumber(item.quantity) }</td>
						<td className="py-1">{ formatNumber(item.taxInclusivePrice) }</td>
						<td className="py-1">{ formatNumber(item.taxInclusiveTotalPrice) }</td>
					</tr>
				)) }
				</tbody>
			</table>

			<div className="flex flex-col gap-1 mb-4 border-b border-dashed border-gray-400 pb-4">
				{ data.settlementAmount > 0 && (
					<div className="flex justify-between">
						<span>مبلغ التسوية:</span>
						<span>{ formatNumber(data.settlementAmount) }</span>
					</div>
				) }
				{ data.settlementPercent > 0 && (
					<div className="flex justify-between">
						<span>نسبة التسوية:</span>
						<span>{ formatNumber(data.settlementPercent) }%</span>
					</div>
				) }
				{ data.settlementReason && (
					<div className="flex justify-between">
						<span>سبب التسوية:</span>
						<span>{ data.settlementReason }</span>
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
				<div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-gray-400">
					<span>الإجمالي بعد الضريبة:</span>
					<span>{ formatNumber(data.totalAfterTax) }</span>
				</div>
			</div>

			<div className="flex flex-col gap-1 mb-4 border-b border-dashed border-gray-400 pb-4">
				<div className="flex justify-between">
					<span>المدفوع:</span>
					<span>{ formatNumber(data.paidAmount) }</span>
				</div>
				<div className="flex justify-between">
					<span>المتبقي:</span>
					<span>{ formatNumber(data.remainingAmount) }</span>
				</div>
			</div>

			{ data.qrBytes && (
				<div className="flex justify-center mb-4">
					<img src={ `data:image/png;base64,${ data.qrBytes }` } alt="QR Code"
					     className="w-40 h-40 object-contain"/>
				</div>
			) }

			{ invoice.policy && (
				<div className="text-center text-[10px] whitespace-pre-wrap mt-4">
					{ invoice.policy }
				</div>
			) }
		</div>
	);
}