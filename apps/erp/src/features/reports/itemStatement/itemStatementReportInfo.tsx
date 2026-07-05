import { ReportField } from "@/features/report/components/reportField.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import type { ItemStatementReportResult } from "@/features/reports/itemStatement/itemStatementReportResult.ts";


interface ItemStatementReportInfoProps
{
	data: ItemStatementReportResult;
}

export function ItemStatementReportInfo({data}: ItemStatementReportInfoProps)
{
	return (
		<div className="flex flex-col gap-3 my-4 print:break-inside-avoid">
			<h3 className="flex justify-between text-primary font-extrabold">
				<span>معلومات المادة</span>
				<span dir="ltr">ITEM INFO</span>
			</h3>

			<div className="grid grid-cols-3 gap-3">
				<ReportField labelAr="رقم المادة" labelEn="Item id" value={ data.itemId.toString() }/>
				<ReportField labelAr="اسم المادة" labelEn="Item name" value={ data.itemName }/>
				<ReportField labelAr="التكلفة" labelEn="Cost" value={ formatNumber(data.cost) }/>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<ReportField labelAr="الكمية" labelEn="Quantity" value={ formatNumber(data.quantity) }/>
				<ReportField labelAr="الحد الأدنى للكمية" labelEn="Min quantity"
				             value={ data.minQuantity != null ? formatNumber(data.minQuantity) : "" }/>
				<ReportField labelAr="الحد الأعلى للكمية" labelEn="Max quantity"
				             value={ data.maxQuantity != null ? formatNumber(data.maxQuantity) : "" }/>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<ReportField labelAr="آخر سعر شراء" labelEn="Last purch price"
				             value={ formatNumber(data.lastBuyPrice) }/>
				<ReportField labelAr="أقل سعر شراء" labelEn="Lowest purch price"
				             value={ formatNumber(data.minBuyPrice) }/>
				<ReportField labelAr="أعلى سعر شراء" labelEn="Highest purch price"
				             value={ formatNumber(data.maxBuyPrice) }/>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<ReportField labelAr="آخر سعر بيع" labelEn="Last sell price"
				             value={ formatNumber(data.lastSellPrice) }/>
				<ReportField labelAr="أقل سعر بيع" labelEn="Lowest sell price"
				             value={ formatNumber(data.minSellPrice) }/>
				<ReportField labelAr="أعلى سعر بيع" labelEn="Highest sell price"
				             value={ formatNumber(data.maxSellPrice) }/>
			</div>

			{ data.notes && (
				<ReportField labelAr="ملاحظات" labelEn="Notes" value={ data.notes }/>
			) }
		</div>
	);
}