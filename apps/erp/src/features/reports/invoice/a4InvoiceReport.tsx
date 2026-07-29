import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { ReportField } from "@/features/report/components/reportField";
import { formatNumber } from "@/features/report/utils/formating";
import type { InvoiceReportResult } from "./invoiceReportResult";
import { InvoiceType } from "@/core/types/invoiceType";


export function A4InvoiceReport({data, isPortal}: { data: InvoiceReportResult, isPortal: boolean })
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
					<div className="flex justify-end w-full h-full pb-6">
						{ data.qrBytes && <img src={ `data:image/png;base64,${ data.qrBytes }` } alt="QR Code"
                                               className="h-28 w-28 object-contain"/> }
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

					<div className="flex justify-between mt-6 print:break-inside-avoid gap-6">
						<div className="flex-1 pt-2">
							{ invoice.policy && (
								<div
									className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/10 p-3 rounded-lg border border-border/50">
									<span className="font-bold text-foreground block mb-1">الشروط والأحكام / Terms & Conditions:</span>
									{ invoice.policy }
								</div>
							) }
						</div>

						<div className="w-72 border border-border rounded-lg overflow-hidden flex flex-col shrink-0">
							{ data.settlementAmount > 0 && (
								<div className="flex justify-between p-2 border-b border-border text-xs">
									<div className="flex flex-col">
										<span className="font-semibold">مبلغ التسوية</span>
										<span className="text-[9px] text-muted-foreground"
										      dir="ltr">Settlement Amount</span>
									</div>
									<span
										className="font-semibold self-center">{ formatNumber(data.settlementAmount) }</span>
								</div>
							) }
							{ data.settlementPercent > 0 && (
								<div className="flex justify-between p-2 border-b border-border text-xs">
									<div className="flex flex-col">
										<span className="font-semibold">نسبة التسوية</span>
										<span className="text-[9px] text-muted-foreground"
										      dir="ltr">Settlement Percent</span>
									</div>
									<span
										className="font-semibold self-center">{ formatNumber(data.settlementPercent) }%</span>
								</div>
							) }
							{ data.settlementReason && (
								<div className="flex justify-between p-2 border-b border-border text-xs">
									<div className="flex flex-col">
										<span className="font-semibold">سبب التسوية</span>
										<span className="text-[9px] text-muted-foreground"
										      dir="ltr">Settlement Reason</span>
									</div>
									<span
										className="font-semibold self-center text-left max-w-[50%]">{ data.settlementReason }</span>
								</div>
							) }
							<div className="flex justify-between p-2 border-b border-border text-xs">
								<div className="flex flex-col">
									<span className="font-semibold">الإجمالي قبل الضريبة</span>
									<span className="text-[9px] text-muted-foreground" dir="ltr">Total Before Tax</span>
								</div>
								<span className="font-semibold self-center">{ formatNumber(data.totalBeforeTax) }</span>
							</div>
							<div className="flex justify-between p-2 border-b border-border text-xs">
								<div className="flex flex-col">
									<span className="font-semibold">قيمة الضريبة</span>
									<span className="text-[9px] text-muted-foreground" dir="ltr">Tax Amount</span>
								</div>
								<span className="font-semibold self-center">{ formatNumber(data.totalTaxAmount) }</span>
							</div>
							<div className="flex justify-between p-2.5 bg-muted/50 text-sm border-b border-border">
								<div className="flex flex-col">
									<span className="font-bold text-primary">الإجمالي بعد الضريبة</span>
									<span className="text-[10px] text-primary" dir="ltr">Total After Tax</span>
								</div>
								<span
									className="font-bold text-primary self-center">{ formatNumber(data.totalAfterTax) }</span>
							</div>
							<div className="flex justify-between p-2 border-b border-border text-xs">
								<div className="flex flex-col">
									<span className="font-semibold">المبلغ المدفوع</span>
									<span className="text-[9px] text-muted-foreground" dir="ltr">Paid Amount</span>
								</div>
								<span
									className="font-semibold self-center text-green-600">{ formatNumber(data.paidAmount) }</span>
							</div>
							<div className="flex justify-between p-2 text-xs">
								<div className="flex flex-col">
									<span className="font-semibold">المتبقي من الفاتورة</span>
									<span className="text-[9px] text-muted-foreground" dir="ltr">Remain Amount</span>
								</div>
								<span
									className="font-semibold self-center text-red-600">{ formatNumber(data.remainingAmount) }</span>
							</div>
						</div>
					</div>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}