import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { LowStockReportTable } from "./lowStockReportTable.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import type { LowStockReportResult } from "./lowStockReportResult.ts";
import { useTranslation } from "react-i18next";


interface LowStockReportProps
{
	isPortal?: boolean;
}

export function LowStockReport({isPortal = false}: LowStockReportProps)
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	const state = Cubits.lowStockReport.state.value;
	const data = "data" in state ? (state.data as LowStockReportResult) : undefined;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportPageContainer>
				<thead className="table-header-group">
				<tr>
					<td className="p-0 pb-4">
						<ReportHeader>
							<div className="flex flex-col gap-1">
								<h1 className="text-xl font-bold">{ t("reports.lowStock", "تقرير النواقص") }</h1>
								<h2 className="text-sm text-muted-foreground font-semibold tracking-wider">LOW STOCK
									REPORT</h2>
							</div>
							<div className="col-span-2 grid grid-cols-2 gap-4">
								<ReportField labelAr="المستودع" labelEn="Store"
								             value={ data?.storeName || "الكل (All)" }/>
							</div>
						</ReportHeader>
					</td>
				</tr>
				</thead>
				<ReportPageBody>
					<LowStockReportTable/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}