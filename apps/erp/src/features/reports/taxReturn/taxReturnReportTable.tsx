import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, TablePreview } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { TaxReturnReportRow } from "@/features/reports/taxReturn/taxReturnReportRow.tsx";


export function TaxReturnReportTable()
{
	useSignals();

	if (Cubits.TaxReturnReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	const data = Cubits.TaxReturnReport.result.value;

	if (!data)
	{
		return <TablePreview.Empty/>;
	}

	return (
		<div className="flex flex-col gap-6 mt-5">
			<div className="border border-border rounded-md overflow-hidden">
				<TaxReturnReportRow.SectionHeader
					titleAr="1- ضريبة القيمة المضافة على المبيعات"
					titleEn="1- Value Added Tax on Sales"
				/>
				<TaxReturnReportRow
					labelAr="1- المبيعات الخاضعة للنسبة الأساسية"
					labelEn="1- Sales subject to the basic rate"
					amount={ data.salesLocal15NoTax }
					amendment={ data.salesLocal15ReturnsNoTax }
				/>
				<TaxReturnReportRow
					labelAr="2- المبيعات المحلية الخاضعة للنسبة الصفرية"
					labelEn="2- Local sales subject to zero rate"
					amount={ data.salesLocal0NoTax }
					amendment={ data.salesLocal0ReturnsNoTax }
				/>
				<TaxReturnReportRow
					labelAr="3- الصادرات"
					labelEn="3- Exports"
					amount={ data.exportNoTax }
					amendment={ data.exportReturnsNoTax }
				/>
				<TaxReturnReportRow
					labelAr="4- المبيعات المعفاة"
					labelEn="4- Exempt sales"
					amount={ data.salesExemptNoTax }
					amendment={ data.salesExemptReturnsNoTax }
				/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<TaxReturnReportRow.SectionHeader
					titleAr="2- ضريبة القيمة المضافة على المشتريات"
					titleEn="2- Value added tax on purchases"
				/>
				<TaxReturnReportRow
					labelAr="1- المشتريات الخاضعة للنسبة الأساسية"
					labelEn="1- Purchases subject to the basic rate"
					amount={ data.purchLocal15NoTax }
					amendment={ data.purchLocal15ReturnsNoTax }
				/>
				<TaxReturnReportRow
					labelAr="2- الاستيرادات الخاضعة لضريبة القيمة المضافة بالنسبة الأساسية والتي تدفع في الجمارك"
					labelEn="2- Imports subject to the basic rate of value added tax that are paid at customs"
					amount={ data.importPaidNoTax }
					amendment={ data.importPaidReturnsNoTax }
				/>
				<TaxReturnReportRow
					labelAr="3- الاستيرادات الخاضعة لضريبة القيمة المضافة والتي تطبق عليها آلية الاحتساب العكسي"
					labelEn="3- Imports subject to value-added tax to which the reverse charge mechanism applies"
					amount={ data.importReverseChargeNoTax }
					amendment={ data.importReverseChargeReturnsNoTax }
				/>
				<TaxReturnReportRow
					labelAr="4- المشتريات الخاضعة للنسبة الصفرية"
					labelEn="4- Zero-rated purchases"
					amount={ data.purch0NoTax }
					amendment={ data.purch0ReturnsNoTax }
				/>
				<TaxReturnReportRow
					labelAr="5- المشتريات المعفاة"
					labelEn="5- Exempt purchases"
					amount={ data.purchExemptNoTax }
					amendment={ data.purchExemptReturnsNoTax }
				/>
			</div>
		</div>
	);
}