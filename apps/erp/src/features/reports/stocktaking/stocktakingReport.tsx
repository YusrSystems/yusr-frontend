import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import type { StocktakingDto } from "@/core/data/stocktaking.ts";
import type { StocktakingItemDto } from "@/core/data/stocktakingItem.ts";


interface StocktakingReportProps
{
	stocktaking?: StocktakingDto;
	isPortal?: boolean;
	titleAr?: string;
	titleEn?: string;
}

export function StocktakingReport({
	stocktaking,
	titleAr = "جرد مواد",
	titleEn = "STOCKTAKING",
	isPortal = true
}: StocktakingReportProps)
{
	if (stocktaking == undefined)
	{
		return null;
	}

	const groupedItems = (() =>
	{
		const groups = new Map<number, StocktakingItemDto[]>();
		stocktaking.items?.forEach((item) =>
		{
			if (!item.itemId)
			{
				return;
			}
			if (!groups.has(item.itemId))
			{
				groups.set(item.itemId, []);
			}
			groups.get(item.itemId)!.push(item);
		});
		return Array.from(groups.values());
	})();

	// Matches StocktakingItemsTable's Update-mode getSystemQuantity: the stored
	// systemQuantity needs the unit's multiplier applied.
	const getSystemQuantity = (group: StocktakingItemDto[]) =>
	{
		const first = group[0];
		if (!first)
		{
			return 0;
		}
		return first.systemQuantity * first.quantityMultiplier;
	};

	const getCalculatedActual = (group: StocktakingItemDto[]) =>
	{
		return group.reduce((sum, item) => sum + (item.actualQuantity || 0) * (item.quantityMultiplier || 1), 0);
	};

	const getVariance = (group: StocktakingItemDto[]) =>
	{
		return getCalculatedActual(group) - getSystemQuantity(group);
	};

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr={ titleAr } titleEn={ titleEn }>
					<ReportHeader.Id id={ stocktaking.id }/>
				</ReportHeader.TitleSection>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
				<ReportField labelAr="المستودع" labelEn="Store" value={ stocktaking.storeName ?? "" }/>
				<ReportField labelAr="بتاريخ" labelEn="Date" value={ stocktaking.date }/>
			</div>

			<ReportPageContainer>
				<ReportPageBody>
					<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
						<thead>
						<tr>
							<ReportTableTh ar="الرقم" en="No."/>
							<ReportTableTh ar="اسم المادة" en="Item name"/>
							<ReportTableTh ar="الكمية في النظام" en="Quantity in system"/>
							<ReportTableTh ar="فرق الكمية" en="Variance"/>
							<ReportTableTh ar="الكمية الفعلية (التكلفة)" en="Actual quantity (Cost)"/>
						</tr>
						</thead>
						<tbody>
						{ groupedItems.map((group, idx) =>
						{
							const isEven = idx % 2 === 0;
							const systemQty = getSystemQuantity(group);
							const variance = getVariance(group);

							return (
								<tr key={ group[0]?.itemId }>
									<ReportTableTd isEven={ isEven }>{ idx + 1 }</ReportTableTd>
									<ReportTableTd isEven={ isEven }
									               align="start">{ group[0]?.itemName }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(systemQty) }</ReportTableTd>
									<ReportTableTd
										isEven={ isEven }
										className={ variance === 0
											? undefined
											: variance > 0
												? "text-emerald-600! font-bold!"
												: "text-destructive! font-bold!" }
									>
										{ variance > 0 ? `+${ formatNumber(variance) }` : formatNumber(variance) }
									</ReportTableTd>
									<ReportTableTd isEven={ isEven } align="start">
										<div className="flex flex-col gap-1">
											{ group.map((item, j) => (
												<div key={ j } className="flex items-center gap-2">
													<span className="text-xs text-muted-foreground min-w-20">
														{ item.unitName }
													</span>
													<span
														className="font-medium">{ formatNumber(item.actualQuantity) }</span>
													{ item.unitCost != null && (
														<span className="text-xs text-muted-foreground">
															(التكلفة: { formatNumber(item.unitCost) })
														</span>
													) }
												</div>
											)) }
										</div>
									</ReportTableTd>
								</tr>
							);
						}) }
						</tbody>
					</table>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}