import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, TablePreview } from "yusr-ui";
import { Cubits } from "@/core/services/cubits";
import { VatReturnReportRow } from "./vatReturnReportRow";


export function VatReturnReportTable()
{
	useSignals();

	if (Cubits.VatReturnReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	const data = Cubits.VatReturnReport.result.value;

	if (!data)
	{
		return <TablePreview.Empty/>;
	}

	return (
		<div className="flex flex-col gap-6 mt-5">
			<div className="border border-border rounded-md overflow-hidden">
				<VatReturnReportRow.SectionHeader titleAr="1- ضريبة القيمة المضافة على المبيعات"/>
				<VatReturnReportRow
					labelAr="1- المبيعات الخاضعة للنسبة الأساسية"
					amount={ data.salesLocal15NoTax }
					amendment={ data.salesLocal15ReturnsNoTax }
				/>
				<VatReturnReportRow
					labelAr="2- المبيعات المحلية الخاضعة للنسبة الصفرية"
					amount={ data.salesLocal0NoTax }
					amendment={ data.salesLocal0ReturnsNoTax }
				/>
				<VatReturnReportRow
					labelAr="3- الصادرات"
					amount={ data.exportNoTax }
					amendment={ data.exportReturnsNoTax }
				/>
				<VatReturnReportRow
					labelAr="4- المبيعات المعفاة"
					amount={ data.salesExemptNoTax }
					amendment={ data.salesExemptReturnsNoTax }
				/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<VatReturnReportRow.SectionHeader titleAr="2- ضريبة القيمة المضافة على المشتريات"/>
				<VatReturnReportRow
					labelAr="1- المشتريات الخاضعة للنسبة الأساسية"
					amount={ data.purchLocal15NoTax }
					amendment={ data.purchLocal15ReturnsNoTax }
				/>
				<VatReturnReportRow
					labelAr="2- الاستيرادات الخاضعة لضريبة القيمة المضافة بالنسبة الأساسية والتي تدفع في الجمارك"
					amount={ data.importPaidNoTax }
					amendment={ data.importPaidReturnsNoTax }
				/>
				<VatReturnReportRow
					labelAr="3- الاستيرادات الخاضعة لضريبة القيمة المضافة والتي تطبق عليها آلية الاحتساب العكسي"
					amount={ data.importReverseChargeNoTax }
					amendment={ data.importReverseChargeReturnsNoTax }
				/>
				<VatReturnReportRow
					labelAr="4- المشتريات الخاضعة للنسبة الصفرية"
					amount={ data.purch0NoTax }
					amendment={ data.purch0ReturnsNoTax }
				/>
				<VatReturnReportRow
					labelAr="5- المشتريات المعفاة"
					amount={ data.purchExemptNoTax }
					amendment={ data.purchExemptReturnsNoTax }
				/>
			</div>
		</div>
	);
}