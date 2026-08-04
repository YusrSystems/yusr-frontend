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

			<div className="grid grid-cols-3 gap-3">
				<ReportField labelAr="رقم المادة" labelEn="Item id" value={ data.itemId.toString() }/>
				<ReportField labelAr="اسم المادة" labelEn="Item name" value={ data.itemName }/>
				<ReportField labelAr="المستودع" labelEn="Store" value={ data.storeName || "الكل (All)" }/>
			</div>

			<div className="grid grid-cols-3 gap-3 mt-2 pt-2">
				<ReportField labelAr="الكمية الافتتاحية" labelEn="Opening Qty"
				             value={ formatNumber(data.openingQuantity) }/>
				<ReportField labelAr="متوسط التكلفة الافتتاحي" labelEn="Opening Avg Cost"
				             value={ formatNumber(data.openingAverageCost) }/>
				<ReportField labelAr="التقييم الافتتاحي" labelEn="Opening Valuation"
				             value={ formatNumber(data.openingValuation) }/>
			</div>

			<div className="grid grid-cols-3 gap-3 mt-2 pt-2">
				<ReportField labelAr="الكمية النهائية" labelEn="Closing Qty"
				             value={ formatNumber(data.closingQuantity) }/>
				<ReportField labelAr="متوسط التكلفة النهائي" labelEn="Closing Avg Cost"
				             value={ formatNumber(data.closingAverageCost) }/>
				<ReportField labelAr="التقييم النهائي" labelEn="Closing Valuation"
				             value={ formatNumber(data.closingValuation) }/>
			</div>

			<div className="grid grid-cols-3 gap-3 mt-2 pt-2">
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