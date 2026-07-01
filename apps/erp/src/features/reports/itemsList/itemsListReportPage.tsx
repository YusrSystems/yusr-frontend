import ReportPage from "@/features/report/reportPage.tsx";
import { ItemsListReport } from "@/features/reports/itemsList/itemsListReport.tsx";
import { useEffect } from "react";
import { Cubits } from "@/core/services/cubits.ts";
import { CrudTablePagination, FilterSection } from "yusr-ui";
import { RenderItemFilterInput } from "@/features/items/itemsPage.tsx";
import { useSignals } from "@preact/signals-react/runtime";


export function ItemsListReportPage()
{
	useSignals();

	useEffect(() =>
	{
		Cubits.items.init(undefined, undefined, 1000);
		Cubits.stores.init();
		Cubits.units.init();
	}, []);

	return (
		<ReportPage>
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