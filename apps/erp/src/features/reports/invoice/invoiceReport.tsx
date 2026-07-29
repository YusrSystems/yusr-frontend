import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { ReportField } from "@/features/report/components/reportField";
import { formatNumber } from "@/features/report/utils/formating";
import type { InvoiceReportResult } from "./invoiceReportResult";
import { InvoicePrintSize } from "@/core/data/setting";
import { Services } from "@/core/services/services";
import { InvoiceType } from "@/core/types/invoiceType";


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
	const isStandard = !!partner.vatNumber;

	const isPurchase = invoice.type === InvoiceType.Purchase || invoice.type === InvoiceType.PurchaseReturn;
	const partnerLabelAr = isPurchase ? "المورد" : "العميل";
	const partnerLabelEn = isPurchase ? "Supplier" : "Customer";

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr={ data.titleAr } titleEn={ data.titleEn }>
					<ReportHeader.Id id={ invoice.id }/>
				</ReportHeader.TitleSection>
				<ReportHeader.MetaDataSection>
					<div className="flex justify-end w-full h-full pb-5">
						{ data.qrBytes && <img src={ `data:image/png;base64,${ data.qrBytes }` } alt="QR Code"
                                               className="h-16 w-16 object-contain"/> }
					</div>
				</ReportHeader.MetaDataSection>
			</ReportHeader>

			<div className="flex flex-col gap-4 mt-6 print:break-inside-avoid">
				<div className="grid grid-cols-2 gap-8">
					<ReportField labelAr="المستودع" labelEn="Store" value={ invoice.storeName }/>
					<ReportField labelAr="بتاريخ" labelEn="Date" value={ invoice.date }/>
				</div>

				<div className="border border-border rounded-lg overflow-hidden print:break-inside-avoid">
					<div className="bg-muted/50 px-4 py-2 border-b border-border flex justify-between items-center">
						<span className="font-bold text-sm">{ partnerLabelAr }</span>
						<span className="font-bold text-sm" dir="ltr">{ partnerLabelEn }</span>
					</div>
					<div className="p-4 grid grid-cols-2 gap-4">
						<ReportField labelAr="الاسم" labelEn="Name" value={ partner.name || "-" }/>
						{ isStandard ? (
							<ReportField labelAr="العنوان" labelEn="Address"
							             value={ [partner.buildingNumber, partner.street, partner.district, partner.cityName].filter(Boolean).join(" - ") || "-" }/>
						) : (
							<ReportField labelAr="رقم الجوال" labelEn="Phone Number"
							             value={ partner.phone || partner.mobile || "-" }/>
						) }

						{ isStandard && (
							<div className="flex flex-col gap-3 border-r border-border pr-4">
								<ReportField labelAr="السجل التجاري" labelEn="CRN" value={ partner.crn || "-" }/>
								<ReportField labelAr="الرقم الضريبي" labelEn="VAT" value={ partner.vatNumber || "-" }/>
							</div>
						) }
					</div>
				</div>
			</div>

			<ReportPageContainer>
				<ReportPageBody>
					<table className="w-full mt-6 border-collapse rounded-lg overflow-hidden">
						<thead>
						<tr>
							<ReportTableTh ar="الرقم" en="No."/>
							<ReportTableTh ar="اسم المادة" en="Item Name" align="start"/>
							<ReportTableTh ar="الوصف" en="Description" align="start"/>
							<ReportTableTh ar="الكمية" en="Quantity"/>
							<ReportTableTh ar="سعر الوحدة" en="Unit price"/>
							<ReportTableTh ar="التسوية" en="Settlement"/>
							<ReportTableTh ar="قيمة الضريبة" en="Tax Amount"/>
							<ReportTableTh ar="الإجمالي بعد الضريبة" en="Total After Tax"/>
						</tr>
						</thead>
						<tbody>
						{ invoice.invoiceItems.map((item, idx) =>
						{
							const isEven = idx % 2 === 0;
							const taxAmount = item.taxInclusiveTotalPrice - item.taxExclusiveTotalPrice;
							return (
								<tr key={ item.id }>
									<ReportTableTd isEven={ isEven }>{ idx + 1 }</ReportTableTd>
									<ReportTableTd isEven={ isEven } align="start">
										<div className="flex flex-col">
											<span className="font-semibold">{ item.itemName }</span>
											<span
												className="text-[10px] text-muted-foreground">{ item.itemUnitPricingMethodName }</span>
										</div>
									</ReportTableTd>
									<ReportTableTd isEven={ isEven } align="start">{ item.notes || "-" }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(item.quantity) }</ReportTableTd>
									<ReportTableTd
										isEven={ isEven }>{ formatNumber(item.taxExclusivePrice) }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(item.settlement) }</ReportTableTd>
									<ReportTableTd isEven={ isEven } className="whitespace-nowrap">
										{ formatNumber(taxAmount) } <span
										className="text-[10px] text-muted-foreground">({ item.totalTaxesPerc }%)</span>
									</ReportTableTd>
									<ReportTableTd isEven={ isEven }
									               className="font-bold">{ formatNumber(item.taxInclusiveTotalPrice) }</ReportTableTd>
								</tr>
							);
						}) }
						</tbody>
					</table>

					<div className="flex justify-end mt-8 print:break-inside-avoid">
						<div className="w-80 border border-border rounded-lg overflow-hidden flex flex-col">
							{ data.settlementAmount > 0 && (
								<div className="flex justify-between p-2.5 border-b border-border text-sm">
									<div className="flex flex-col">
										<span className="font-semibold">مبلغ التسوية</span>
										<span className="text-[10px] text-muted-foreground"
										      dir="ltr">Settlement Amount</span>
									</div>
									<span
										className="font-semibold self-center">{ formatNumber(data.settlementAmount) }</span>
								</div>
							) }
							{ data.settlementPercent > 0 && (
								<div className="flex justify-between p-2.5 border-b border-border text-sm">
									<div className="flex flex-col">
										<span className="font-semibold">نسبة التسوية</span>
										<span className="text-[10px] text-muted-foreground"
										      dir="ltr">Settlement Percent</span>
									</div>
									<span
										className="font-semibold self-center">{ formatNumber(data.settlementPercent) }%</span>
								</div>
							) }
							{ data.settlementReason && (
								<div className="flex justify-between p-2.5 border-b border-border text-sm">
									<div className="flex flex-col">
										<span className="font-semibold">سبب التسوية</span>
										<span className="text-[10px] text-muted-foreground"
										      dir="ltr">Settlement Reason</span>
									</div>
									<span
										className="font-semibold self-center text-left max-w-[50%]">{ data.settlementReason }</span>
								</div>
							) }
							<div className="flex justify-between p-2.5 border-b border-border text-sm">
								<div className="flex flex-col">
									<span className="font-semibold">المبلغ المدفوع</span>
									<span className="text-[10px] text-muted-foreground" dir="ltr">Paid Amount</span>
								</div>
								<span className="font-semibold self-center">{ formatNumber(data.paidAmount) }</span>
							</div>
							<div className="flex justify-between p-2.5 border-b border-border text-sm">
								<div className="flex flex-col">
									<span className="font-semibold">المتبقي من الفاتورة</span>
									<span className="text-[10px] text-muted-foreground" dir="ltr">Remain Amount</span>
								</div>
								<span
									className="font-semibold self-center">{ formatNumber(data.remainingAmount) }</span>
							</div>
							<div className="flex justify-between p-2.5 border-b border-border text-sm">
								<div className="flex flex-col">
									<span className="font-semibold">الإجمالي قبل الضريبة</span>
									<span className="text-[10px] text-muted-foreground"
									      dir="ltr">Total Before Tax</span>
								</div>
								<span className="font-semibold self-center">{ formatNumber(data.totalBeforeTax) }</span>
							</div>
							<div className="flex justify-between p-2.5 border-b border-border text-sm">
								<div className="flex flex-col">
									<span className="font-semibold">قيمة الضريبة</span>
									<span className="text-[10px] text-muted-foreground" dir="ltr">Tax Amount</span>
								</div>
								<span className="font-semibold self-center">{ formatNumber(data.totalTaxAmount) }</span>
							</div>
							<div className="flex justify-between p-2.5 bg-muted/50 text-base">
								<div className="flex flex-col">
									<span className="font-bold text-primary">الإجمالي بعد الضريبة</span>
									<span className="text-[10px] text-primary" dir="ltr">Total After Tax</span>
								</div>
								<span
									className="font-bold text-primary self-center">{ formatNumber(data.totalAfterTax) }</span>
							</div>
						</div>
					</div>

					{ invoice.policy && (
						<div
							className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground whitespace-pre-wrap print:break-inside-avoid">
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
							<div className="text-[10px] text-gray-500">{ item.itemUnitPricingMethodName }</div>
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