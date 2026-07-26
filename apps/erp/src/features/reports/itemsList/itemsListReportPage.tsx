import ReportPage from "@/features/report/reportPage.tsx";
import { ItemsListReport } from "@/features/reports/itemsList/itemsListReport.tsx";
import { useEffect } from "react";
import { Cubits } from "@/core/services/cubits.ts";
import { CrudTablePagination, FilterSection } from "yusr-ui";
import { RenderItemFilterInput } from "@/features/items/itemsPage.tsx";
import { useSignals } from "@preact/signals-react/runtime";
import { type ItemDto, ItemType } from "@/core/data/item.ts";
import { APP_NAME } from "../../../../appConfig.ts";


export function ItemsListReportPage()
{
	useSignals();

	useEffect(() =>
	{
		Cubits.items.init(undefined, undefined, 1000);
		Cubits.stores.init();
		Cubits.units.init();
	}, []);

	useEffect(() =>
	{
		document.title = "قائمة المواد";

		return () =>
		{
			document.title = APP_NAME;
		};
	}, []);

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<ItemDto>
					fileName="تقرير_قائمة_المواد"
					getRows={ async () => Cubits.items.entities.value ?? [] }
					columns={ [
						{header: "اسم المادة", accessor: (r) => r.name},
						{header: "النوع", accessor: (r) => r.type === ItemType.Product ? "منتج" : "خدمة"},
						{header: "الوصف", accessor: (r) => r.description ?? ""},
						{header: "التصنيف", accessor: (r) => r.class ?? ""},
						{header: "العلامة التجارية", accessor: (r) => r.brand ?? ""},
						{header: "وحدة البيع الرئيسية", accessor: (r) => r.sellUnitName ?? ""},
						{header: "الرصيد الافتتاحي", accessor: (r) => r.initialQuantity.toString()},
						{header: "المخزون الإجمالي الحالي", accessor: (r) => r.quantity.toString()},
						{header: "حد الطلب (الأدنى)", accessor: (r) => r.minQuantity?.toString() ?? "0"},
						{header: "الحد الأعلى للمخزون", accessor: (r) => r.maxQuantity?.toString() ?? "0"},
						{header: "التكلفة الافتتاحية", accessor: (r) => r.initialCost.toString()},
						{header: "التكلفة الحالية", accessor: (r) => r.cost.toString()},
						{header: "آخر سعر شراء", accessor: (r) => r.lastBuyPrice.toString()},
						{header: "خاضع للضريبة", accessor: (r) => r.taxable ? "نعم" : "لا"},
						{header: "كود سبب الإعفاء الضريبي", accessor: (r) => r.exemptionReasonCode ?? ""},
						{header: "سبب الإعفاء الضريبي", accessor: (r) => r.exemptionReason ?? ""},
						{header: "الأسعار شاملة الضريبة", accessor: (r) => r.taxIncluded ? "نعم" : "لا"},
						{
							header: "الضرائب المطبقة",
							accessor: (r) => r.itemTaxes ? JSON.stringify(r.itemTaxes.map(t => ({
								taxId: t.taxId,
								taxName: t.taxName,
								taxPercentage: t.taxPercentage
							}))) : "[]"
						},
						{
							header: "توزيع المخزون",
							accessor: (r) => r.itemStores ? JSON.stringify(r.itemStores.map(s => ({
								storeId: s.storeId,
								storeName: s.storeName,
								quantity: s.quantity,
								initialQuantity: s.initialQuantity
							}))) : "[]"
						},
						{
							header: "طرق التسعير",
							accessor: (r) => r.itemUnitPricingMethods ? JSON.stringify(r.itemUnitPricingMethods.map(p => ({
								unitId: p.unitId,
								itemUnitPricingMethodName: p.itemUnitPricingMethodName,
								price: p.price,
								barcode: p.barcode || ""
							}))) : "[]"
						},
						{header: "الموقع / الرف", accessor: (r) => r.location ?? ""},
						{header: "ملاحظات", accessor: (r) => r.notes ?? ""}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<FilterSection
					fieldsCubit={ Cubits.itemFilterFields }
					onApply={ (groups) => Cubits.items.applyFilterGroups(groups) }
					onClear={ () => Cubits.items.clearFilterGroups() }
					renderCustomInput={ RenderItemFilterInput }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ItemsListReport/>
			</div>

			<CrudTablePagination
				className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
				pageSize={ Cubits.items.pageSize.value }
				totalNumber={ Cubits.items.count.value }
				currentPage={ Cubits.items.currentPage.value }
				onPageChanged={ (newPage) =>
				{
					Cubits.items.changePage(newPage);
				} }
			/>

		</ReportPage>
	);
}