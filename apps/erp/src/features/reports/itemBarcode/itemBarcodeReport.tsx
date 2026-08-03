// file: features/reports/itemBarcode/itemBarcodeReport.tsx
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportContainer } from "@/features/report/reportContainer.tsx";
import { Services } from "@/core/services/services.ts";
import type Item from "@/core/data/item";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import type { ItemUoM } from "@/core/data/itemUoM.ts";
import type { ItemPrice } from "@/core/data/itemPrice.ts";


export interface ItemBarcodeReportProps
{
	item: Item;
	itemUoM?: ItemUoM;
	itemPrice?: ItemPrice,
	barcodesQtn: number;
	isPortal?: boolean;
}

function BarcodeSvg({value}: { value: string })
{
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() =>
	{
		if (!svgRef.current || !value)
		{
			return;
		}

		try
		{
			JsBarcode(svgRef.current, value, {
				format: "CODE128",
				height: 40,
				width: 1.5,
				displayValue: false,
				margin: 0
			});

			svgRef.current.style.width = "100%";
			svgRef.current.style.height = "100%";
		}
		catch
		{
			// Invalid barcode fallback
		}
	}, [value]);

	return (
		<div className="w-full h-[12mm] flex justify-center items-center overflow-hidden">
			<svg ref={ svgRef } className="object-contain max-h-full max-w-full"/>
		</div>
	);
}

export function ItemBarcodeReport({item, itemUoM, itemPrice, barcodesQtn, isPortal = true}: ItemBarcodeReportProps)
{
	useSignals();

	if (!itemUoM || !itemPrice)
	{
		return;
	}

	const barcode = itemUoM.barcode.value;
	if (!barcode)
	{
		return null;
	}

	// ==========================================
	// CONFIGURATION VARIABLES
	// ==========================================
	const cols = 4;
	const rows = 10;
	const gapMm = 1.5;
	const safePrintableHeightMm = 260;
	const itemsPerPage = cols * rows;

	const companyName = Services.auth.setting?.companyName.value ?? "";

	const allBarcodes = Array.from({length: barcodesQtn});
	const pages = [];
	for (let i = 0; i < allBarcodes.length; i += itemsPerPage)
	{
		pages.push(allBarcodes.slice(i, i + itemsPerPage));
	}

	return (
		<ReportContainer isPortal={ isPortal }>
			{ pages.map((pageItems, pageIdx) => (
				<div
					key={ pageIdx }
					dir="rtl"
					className="grid w-full box-border print:break-after-page page-break-after-always overflow-hidden"
					style={ {
						height: `${ safePrintableHeightMm }mm`,
						maxHeight: `${ safePrintableHeightMm }mm`,
						gap: `${ gapMm }mm`,
						gridTemplateColumns: `repeat(${ cols }, minmax(0, 1fr))`,
						gridTemplateRows: `repeat(${ rows }, minmax(0, 1fr))`
					} }
				>
					{ pageItems.map((_, idx) => (
						<div
							key={ idx }
							className="flex flex-col gap-1.5 justify-between items-center p-1 border border-gray-100 rounded print:break-inside-avoid overflow-hidden h-full w-full"
						>
							<div className="w-full flex flex-col items-center gap-0.5 overflow-hidden">
								<p className="text-[6.5pt] leading-none truncate max-w-full">
									{ companyName }
								</p>

								<BarcodeSvg value={ barcode }/>

								<p className="text-[6pt] font-mono tracking-wider leading-none">
									{ barcode }
								</p>

								<p className="text-[6.5pt] leading-tight text-center line-clamp-1 max-w-full">
									{ item.name.value } | { itemUoM.unitName.value }
								</p>
							</div>

							<div className="flex items-center gap-0.5 overflow-hidden">
								<p className="text-[7pt] font-bold leading-none text-center mt-auto pt-0.5">
									{ itemPrice.price.value.toLocaleString(undefined, {maximumFractionDigits: 0}) }
								</p>
								<ErpCurrencyIcon className="w-3 h-3"/>
							</div>
						</div>
					)) }
				</div>
			)) }
		</ReportContainer>
	);
}