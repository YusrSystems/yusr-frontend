import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { formatNumber } from "@/features/report/utils/formating";
import type { InvoiceReportResult } from "./invoiceReportResult";
import { InvoicePrintSize } from "@/core/data/setting";
import { Services } from "@/core/services/services";


export function InvoiceReport({data, isPortal = true}: { data?: InvoiceReportResult, isPortal?: boolean })
{
	if (!data) return null;

	if (data.invoicePrintSize === InvoicePrintSize.ThermalPrinter)
	{
		return <ThermalInvoiceReport data={ data } isPortal={ isPortal }/>;
	}

	return <A4InvoiceReport data={ data } isPortal={ isPortal }/>;
}

function A4InvoiceReport({data, isPortal}: { data: InvoiceReportResult, isPortal: boolean })
{
	const {invoice, partner} = data;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr={ data.titleAr } titleEn={ data.titleEn }>
					<ReportHeader.Id id={ invoice.id }/>
				</ReportHeader.TitleSection>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<div className="flex flex-col gap-4 mt-6 print:break-inside-avoid">
				<div className="grid grid-cols-2 gap-8">
					<div className="flex flex-col gap-2">
						<h3 className="font-bold text-sm border-b pb-1">معلومات العميل / Customer Info</h3>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<span className="text-muted-foreground">الاسم / Name:</span>
							<span className="font-semibold">{ partner.name || "-" }</span>

							<span className="text-muted-foreground">الرقم الضريبي / VAT No:</span>
							<span className="font-semibold">{ partner.vatNumber || "-" }</span>

							<span className="text-muted-foreground">العنوان / Address:</span>
							<span className="font-semibold">
		{ [partner.buildingNumber, partner.street, partner.district, partner.cityName].filter(Boolean).join(" - ") || "-" }
	</span>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="font-bold text-sm border-b pb-1">معلومات الفاتورة / Invoice Info</h3>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<span className="text-muted-foreground">التاريخ / Date:</span>
							<span className="font-semibold">{ invoice.date }</span>

							<span className="text-muted-foreground">تاريخ الإصدار / Issue Date:</span>
							<span
								className="font-semibold">{ new Date(invoice.createdAt).toLocaleString("en-CA") }</span>

							{ invoice.originalInvoiceId && (
								<>
									<span className="text-muted-foreground">الفاتورة الأصلية / Original Inv:</span>
									<span className="font-semibold">#{ invoice.originalInvoiceId }</span>
								</>
							) }
						</div>
					</div>
				</div>
			</div>

			<ReportPageContainer>
				<ReportPageBody>
					<table className="w-full mt-6 border-collapse rounded-lg overflow-hidden">
						<thead>
						<tr>
							<ReportTableTh ar="الرقم" en="No."/>
							<ReportTableTh ar="الصنف" en="Item" align="start"/>
							<ReportTableTh ar="الكمية" en="Qty"/>
							<ReportTableTh ar="سعر الوحدة" en="Unit Price"/>
							<ReportTableTh ar="الخصم" en="Discount"/>
							<ReportTableTh ar="الإجمالي (غير شامل)" en="Total (Excl. VAT)"/>
							<ReportTableTh ar="الضريبة" en="VAT"/>
							<ReportTableTh ar="الإجمالي (شامل)" en="Total (Incl. VAT)"/>
						</tr>
						</thead>
						<tbody>
						{ invoice.invoiceItems.map((item, idx) =>
						{
							const isEven = idx % 2 === 0;
							return (
								<tr key={ item.id }>
									<ReportTableTd isEven={ isEven }>{ idx + 1 }</ReportTableTd>
									<ReportTableTd isEven={ isEven } align="start">
										<div className="flex flex-col">
											<span>{ item.itemName }</span>
											<span
												className="text-[10px] text-muted-foreground">{ item.itemUnitPricingMethodName }</span>
										</div>
									</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(item.quantity) }</ReportTableTd>
									<ReportTableTd
										isEven={ isEven }>{ formatNumber(item.taxExclusivePrice) }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(item.settlement) }</ReportTableTd>
									<ReportTableTd
										isEven={ isEven }>{ formatNumber(item.taxExclusiveTotalPrice) }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ item.totalTaxesPerc }%</ReportTableTd>
									<ReportTableTd isEven={ isEven }
									               className="font-bold">{ formatNumber(item.taxInclusiveTotalPrice) }</ReportTableTd>
								</tr>
							);
						}) }
						</tbody>
					</table>

					<div className="flex justify-between mt-8 print:break-inside-avoid">
						<div className="w-40 h-40">
							{ data.qrBytes && <img src={ `data:image/png;base64,${ data.qrBytes }` } alt="QR Code"
                                                   className="w-full h-full object-contain"/> }
						</div>

						<div className="w-80 flex flex-col gap-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">الإجمالي قبل الضريبة / Total (Excl. VAT):</span>
								<span className="font-semibold">{ formatNumber(data.totalBeforeTax) }</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">إجمالي الخصم / Total Discount:</span>
								<span className="font-semibold">{ formatNumber(data.settlementAmount) }</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">إجمالي الضريبة / Total VAT:</span>
								<span className="font-semibold">{ formatNumber(data.totalTaxAmount) }</span>
							</div>
							<div className="flex justify-between text-base font-bold border-t border-border pt-2 mt-1">
								<span>الإجمالي المستحق / Total Due:</span>
								<span>{ formatNumber(data.totalAfterTax) }</span>
							</div>
							<div className="flex justify-between text-sm text-green-600 mt-2">
								<span>المبلغ المدفوع / Paid Amount:</span>
								<span className="font-semibold">{ formatNumber(data.paidAmount) }</span>
							</div>
							<div className="flex justify-between text-sm text-red-600">
								<span>المبلغ المتبقي / Remaining Amount:</span>
								<span className="font-semibold">{ formatNumber(data.remainingAmount) }</span>
							</div>
						</div>
					</div>

					{ invoice.policy && (
						<div
							className="mt-8 pt-4 border-t border-border text-xs text-muted-foreground whitespace-pre-wrap print:break-inside-avoid">
							{ invoice.policy }
						</div>
					) }
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}

function ThermalInvoiceReport({data, isPortal}: { data: InvoiceReportResult, isPortal: boolean })
{
	const {invoice, partner} = data;
	const setting = Services.auth.setting;

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
				<p><span className="font-bold">العميل:</span> { partner.name || "عميل نقدي" }</p>
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
						<td className="py-1">{ item.itemName }</td>
						<td className="py-1 text-center">{ formatNumber(item.quantity) }</td>
						<td className="py-1">{ formatNumber(item.taxInclusivePrice) }</td>
						<td className="py-1">{ formatNumber(item.taxInclusiveTotalPrice) }</td>
					</tr>
				)) }
				</tbody>
			</table>

			<div className="flex flex-col gap-1 mb-4 border-b border-dashed border-gray-400 pb-4">
				<div className="flex justify-between">
					<span>الإجمالي (غير شامل):</span>
					<span>{ formatNumber(data.totalBeforeTax) }</span>
				</div>
				<div className="flex justify-between">
					<span>الخصم:</span>
					<span>{ formatNumber(data.settlementAmount) }</span>
				</div>
				<div className="flex justify-between">
					<span>ضريبة القيمة المضافة:</span>
					<span>{ formatNumber(data.totalTaxAmount) }</span>
				</div>
				<div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-gray-400">
					<span>الإجمالي المستحق:</span>
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
					     className="w-32 h-32 object-contain"/>
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