// import ReportPage from "@/features/report/reportPage.tsx";
// import { ReportContainer } from "@/features/report/reportContainer.tsx";
// import ReportHeader from "@/features/report/reportHeader.tsx";
// import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
// import ReportPageHeader from "@/features/report/reportPageHeader.tsx";
// import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
// import ReportPageFooter from "@/features/report/reportPageFooter.tsx";
// import { DefaultReportPageFooter } from "@/features/report/defaultReportPageFooter.tsx";
//
//
// export function TestReport()
// {
// 	return (
// 		<ReportPage>
// 			<ReportContainer>
//
// 				<ReportHeader>
// 					<ReportHeader.CompanySection/>
// 					<ReportHeader.TitleSection titleAr="اختبار" titleEn="test">
// 						<ReportHeader.Id id={ 1 }/>
// 					</ReportHeader.TitleSection>
// 					<ReportHeader.MetaDataSection/>
// 				</ReportHeader>
//
// 				<ReportPageContainer>
//
// 					<ReportPageHeader>
// 						put here the page header
// 					</ReportPageHeader>
//
// 					<ReportPageBody>
// 						put here the page body
// 					</ReportPageBody>
//
// 					<ReportPageFooter>
// 						<DefaultReportPageFooter/>
// 					</ReportPageFooter>
//
// 				</ReportPageContainer>
//
// 			</ReportContainer>
//
// 		</ReportPage>
// 	);
// }

import ReportPage from "@/features/report/reportPage.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ReportContainer } from "@/features/report/reportContainer.tsx";
import { ReportBuyerBox } from "@/features/report/invoiceReport/reportBuyerBox.tsx";
import { type InvoiceLineItem, ReportInvoiceTable } from "@/features/report/invoiceReport/reportInvoiceTable.tsx";
import { ReportInvoiceSummary } from "@/features/report/invoiceReport/reportInvoiceSummary.tsx";
import type { AccountDto } from "@/core/data/account.ts";

// --- Test data, shaped like InvoiceRendererData. Swap with real data later. ---

const testItems: InvoiceLineItem[] = [
	{
		id: 1,
		itemName: "تركيب في الموقع",
		quantity: 1,
		unitPrice: 260.87,
		settlementAmount: 35.74,
		taxAmount: 44.49,
		taxPercent: 15,
		totalAfterTax: 341.10
	},
	{
		id: 2,
		itemName: "صندوق حديد",
		quantity: 4,
		unitPrice: 869.57,
		settlementAmount: 119.13,
		taxAmount: 148.31,
		taxPercent: 15,
		totalAfterTax: 4548.00
	},
	{
		id: 3,
		itemName: "قواعد حديد",
		quantity: 3,
		unitPrice: 184.96,
		settlementAmount: 25.34,
		taxAmount: 31.54,
		taxPercent: 15,
		totalAfterTax: 725.52
	},
	{
		id: 4,
		itemName: "علبة قواطع",
		description: "Breaker Box",
		quantity: 7,
		unitPrice: 92.52,
		settlementAmount: 12.68,
		taxAmount: 15.78,
		taxPercent: 15,
		totalAfterTax: 846.86
	},
	{
		id: 1,
		itemName: "تركيب في الموقع",
		quantity: 1,
		unitPrice: 260.87,
		settlementAmount: 35.74,
		taxAmount: 44.49,
		taxPercent: 15,
		totalAfterTax: 341.10
	},
	{
		id: 2,
		itemName: "صندوق حديد",
		quantity: 4,
		unitPrice: 869.57,
		settlementAmount: 119.13,
		taxAmount: 148.31,
		taxPercent: 15,
		totalAfterTax: 4548.00
	},
	{
		id: 3,
		itemName: "قواعد حديد",
		quantity: 3,
		unitPrice: 184.96,
		settlementAmount: 25.34,
		taxAmount: 31.54,
		taxPercent: 15,
		totalAfterTax: 725.52
	},
	{
		id: 4,
		itemName: "علبة قواطع",
		description: "Breaker Box",
		quantity: 7,
		unitPrice: 92.52,
		settlementAmount: 12.68,
		taxAmount: 15.78,
		taxPercent: 15,
		totalAfterTax: 846.86
	},
	{
		id: 1,
		itemName: "تركيب في الموقع",
		quantity: 1,
		unitPrice: 260.87,
		settlementAmount: 35.74,
		taxAmount: 44.49,
		taxPercent: 15,
		totalAfterTax: 341.10
	},
	{
		id: 2,
		itemName: "صندوق حديد",
		quantity: 4,
		unitPrice: 869.57,
		settlementAmount: 119.13,
		taxAmount: 148.31,
		taxPercent: 15,
		totalAfterTax: 4548.00
	},
	{
		id: 3,
		itemName: "قواعد حديد",
		quantity: 3,
		unitPrice: 184.96,
		settlementAmount: 25.34,
		taxAmount: 31.54,
		taxPercent: 15,
		totalAfterTax: 725.52
	},
	{
		id: 4,
		itemName: "علبة قواطع",
		description: "Breaker Box",
		quantity: 7,
		unitPrice: 92.52,
		settlementAmount: 12.68,
		taxAmount: 15.78,
		taxPercent: 15,
		totalAfterTax: 846.86
	}, {
		id: 1,
		itemName: "تركيب في الموقع",
		quantity: 1,
		unitPrice: 260.87,
		settlementAmount: 35.74,
		taxAmount: 44.49,
		taxPercent: 15,
		totalAfterTax: 341.10
	},
	{
		id: 2,
		itemName: "صندوق حديد",
		quantity: 4,
		unitPrice: 869.57,
		settlementAmount: 119.13,
		taxAmount: 148.31,
		taxPercent: 15,
		totalAfterTax: 4548.00
	},
	{
		id: 3,
		itemName: "قواعد حديد",
		quantity: 3,
		unitPrice: 184.96,
		settlementAmount: 25.34,
		taxAmount: 31.54,
		taxPercent: 15,
		totalAfterTax: 725.52
	},
	{
		id: 4,
		itemName: "علبة قواطع",
		description: "Breaker Box",
		quantity: 7,
		unitPrice: 92.52,
		settlementAmount: 12.68,
		taxAmount: 15.78,
		taxPercent: 15,
		totalAfterTax: 846.86
	}, {
		id: 1,
		itemName: "تركيب في الموقع",
		quantity: 1,
		unitPrice: 260.87,
		settlementAmount: 35.74,
		taxAmount: 44.49,
		taxPercent: 15,
		totalAfterTax: 341.10
	},
	{
		id: 2,
		itemName: "صندوق حديد",
		quantity: 4,
		unitPrice: 869.57,
		settlementAmount: 119.13,
		taxAmount: 148.31,
		taxPercent: 15,
		totalAfterTax: 4548.00
	},
	{
		id: 3,
		itemName: "قواعد حديد",
		quantity: 3,
		unitPrice: 184.96,
		settlementAmount: 25.34,
		taxAmount: 31.54,
		taxPercent: 15,
		totalAfterTax: 725.52
	},
	{
		id: 4,
		itemName: "علبة قواطع",
		description: "Breaker Box",
		quantity: 7,
		unitPrice: 92.52,
		settlementAmount: 12.68,
		taxAmount: 15.78,
		taxPercent: 15,
		totalAfterTax: 846.86
	}, {
		id: 1,
		itemName: "تركيب في الموقع",
		quantity: 1,
		unitPrice: 260.87,
		settlementAmount: 35.74,
		taxAmount: 44.49,
		taxPercent: 15,
		totalAfterTax: 341.10
	},
	{
		id: 2,
		itemName: "صندوق حديد",
		quantity: 4,
		unitPrice: 869.57,
		settlementAmount: 119.13,
		taxAmount: 148.31,
		taxPercent: 15,
		totalAfterTax: 4548.00
	},
	{
		id: 3,
		itemName: "قواعد حديد",
		quantity: 3,
		unitPrice: 184.96,
		settlementAmount: 25.34,
		taxAmount: 31.54,
		taxPercent: 15,
		totalAfterTax: 725.52
	},
	{
		id: 4,
		itemName: "علبة قواطع",
		description: "Breaker Box",
		quantity: 7,
		unitPrice: 92.52,
		settlementAmount: 12.68,
		taxAmount: 15.78,
		taxPercent: 15,
		totalAfterTax: 846.86
	}
];

const account: AccountDto = {
	name: "Standard Invoice Account",
	cityName: "الجماوات - السلام - 5423 - 12345",
	crn: "-",
	vatNumber: "399999999800003"
};

const testSummary = {
	settlementPercent: 13.70,
	paidAmount: 6461.48,
	remainAmount: 0.00,
	totalBeforeTax: 5618.68,
	taxAmount: 842.80,
	totalAfterTax: 6461.48
};

const policyText = `سياسة الاستبدال والاسترجاع
إذا رغبت في استرجاع أو استبدال المنتج بعد شرائه فيسعدنا تلبية رغبتك وفق الشروط التالية:
١- إحضار أصل فاتورة الشراء.
٢- أن يكون المنتج المراد استبداله أو استرجاعه بحالته الأصلية بدون أي استخدام وبكامل ملحقاته واكسسورات تغليفه.
٣- الاستبدال أو الاسترجاع يكون خلال ثلاثة أيام من تاريخ الفاتورة بحد أقصى.
٤- في حالة وجود عيب مصنعي او عطل فني في المنتج خلال فترة الضمان فيكون للمؤسسة مهلة عشرون يوما للتواصل مع الوكيل لإصلاح العطل.`;

export function TestReport()
{
	return (
		<ReportPage>
			<ReportContainer>
				<ReportHeader>
					<ReportHeader.CompanySection/>
					<ReportHeader.TitleSection titleAr="فاتورة بيع ضريبية" titleEn="SALES TAX INVOICE">
						<ReportHeader.Id id={ 602 }/>
					</ReportHeader.TitleSection>
					<ReportHeader.MetaDataSection/>
				</ReportHeader>

				<div className="flex flex-col gap-3 pt-5 pb-2">
					<div className="flex justify-between gap-8 py-1">
						<ReportField labelAr="المستودع:" labelEn="Store:" value="مخزن B"/>
						<ReportField labelAr="بتاريخ:" labelEn="Date:" value="2026-06-26"/>
					</div>

					<ReportBuyerBox account={ account }/>
				</div>

				<ReportPageContainer>
					<ReportPageBody>
						<div className="py-2">
							<ReportInvoiceTable items={ testItems }/>
						</div>
						<ReportInvoiceSummary data={ testSummary }/>
						<p className="text-[10px] text-foreground whitespace-pre-line leading-relaxed">
							{ policyText }
						</p>
					</ReportPageBody>
				</ReportPageContainer>
			</ReportContainer>
		</ReportPage>
	);
}