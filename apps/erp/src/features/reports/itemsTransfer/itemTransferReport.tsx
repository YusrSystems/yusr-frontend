import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import type { ItemTransferDto, ItemTransfersItemDto } from "@/core/data/itemTransfer.ts";


interface ItemTransferReportProps
{
	itemTransfer?: ItemTransferDto;
	isPortal?: boolean;
	titleAr?: string;
	titleEn?: string;
}

export function ItemTransferReport({
	itemTransfer,
	titleAr = "نقل مواد",
	titleEn = "ITEMS TRANSFER",
	isPortal = true
}: ItemTransferReportProps)
{
	if (itemTransfer == undefined)
	{
		return;
	}

	// Row doesn't carry its own multiplier — resolve it from the unit's
	// definition within the row's itemUnitPricingMethods list.
	const getMultiplier = (item: ItemTransfersItemDto) =>
		item.itemUnitPricingMethods?.find((m) => m.id === item.itemUnitPricingMethodId)?.quantityMultiplier ?? 1;

	const rows = itemTransfer.itemTransfersItems ?? [];

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr={ titleAr } titleEn={ titleEn }>
					<ReportHeader.Id id={ itemTransfer.id }/>
				</ReportHeader.TitleSection>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<div className="flex flex-col gap-3 my-4 print:break-inside-avoid">
				<ReportField labelAr="تم نقل مواد من المستودع" labelEn="Transferred from store"
				             value={ itemTransfer.fromStoreName ?? "" }/>
				<ReportField labelAr="إلى المستودع" labelEn="To store" value={ itemTransfer.toStoreName ?? "" }/>
				<ReportField labelAr="بتاريخ" labelEn="Date" value={ itemTransfer.date }/>
			</div>

			<ReportPageContainer>
				<ReportPageBody>
					<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
						<thead>
						<tr>
							<ReportTableTh ar="الرقم" en="No."/>
							<ReportTableTh ar="رقم المادة" en="Item id"/>
							<ReportTableTh ar="اسم المادة" en="Item name"/>
							<ReportTableTh ar="طريقة تسعير" en="Pricing method name"/>
							<ReportTableTh ar="الكمية" en="Quantity"/>
							<ReportTableTh ar="الكمية في وحدة المادة" en="Quantity in item unit"/>
							<ReportTableTh ar="مجموع كمية المادة" en="Total item quantity"/>
						</tr>
						</thead>
						<tbody>
						{ rows.map((item, idx) =>
						{
							const isEven = idx % 2 === 0;
							const multiplier = getMultiplier(item);
							const totalItemQuantity = item.quantity * multiplier;

							return (
								<tr key={ `${ item.itemId }-${ item.itemUnitPricingMethodId }` }>
									<ReportTableTd isEven={ isEven }>{ idx + 1 }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ item.itemId }</ReportTableTd>
									<ReportTableTd isEven={ isEven } align="start">{ item.itemName }</ReportTableTd>
									<ReportTableTd isEven={ isEven }
									               align="start">{ item.itemUnitPricingMethodName }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(item.quantity) }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(multiplier) }</ReportTableTd>
									<ReportTableTd isEven={ isEven }>{ formatNumber(totalItemQuantity) }</ReportTableTd>
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