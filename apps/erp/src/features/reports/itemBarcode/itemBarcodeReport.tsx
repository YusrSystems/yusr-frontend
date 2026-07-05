import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportContainer } from "@/features/report/reportContainer.tsx";
import { Services } from "@/core/services/services.ts";
import type Item from "@/core/data/item";
import type { ItemUnitPricingMethod } from "@/core/data/itemUnitPricingMethod";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export interface ItemBarcodeReportProps
{
	item: Item;
	iupm: ItemUnitPricingMethod;
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
				height: 40, // Base height (will be constrained by CSS)
				width: 1.5, // Slightly thinner lines so longer barcodes fit better
				displayValue: false,
				margin: 0
			});

			// CRITICAL FIX: Override JsBarcode's hardcoded dimensions so CSS can take over
			// without warping the aspect ratio.
			svgRef.current.style.width = "100%";
			svgRef.current.style.height = "100%";
		}
		catch
		{
			// Invalid barcode input
		}
	}, [value]);

	// Use object-contain to ensure the barcode scales to fit the width but never exceeds the fixed height
	return (
		<div className="w-full h-[12mm] flex justify-center items-center overflow-hidden">
			<svg ref={ svgRef } className="object-contain max-h-full max-w-full"/>
		</div>
	);
}

export function ItemBarcodeReport({item, iupm, barcodesQtn, isPortal = true}: ItemBarcodeReportProps)
{
	useSignals();

	const barcode = iupm.barcode.value;
	if (!barcode)
	{
		return null;
	}

	// ==========================================
	// CONFIGURATION VARIABLES
	// ==========================================
	const cols = 4;
	const rows = 10;

	// The Gap between items
	const gapMm = 1.5;

	// MATH CORRECTION FOR PAGINATION:
	// A4 total height = 297mm.
	// ReportContainer @page margins = 5mm (top) + 12mm (bottom) = 17mm.
	// Printable space = 297mm - 17mm = 280mm.
	// We use 279mm as a safety buffer to prevent browser rounding errors from creating a blank page.
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
						// Use exact safe printable height
						height: `${ safePrintableHeightMm }mm`,
						maxHeight: `${ safePrintableHeightMm }mm`,
						gap: `${ gapMm }mm`,

						// DYNAMIC CSS GRID:
						gridTemplateColumns: `repeat(${ cols }, minmax(0, 1fr))`,
						// Using `1fr` lets the browser calculate the exact perfect height per row
						// automatically subtracting the gaps, avoiding calc() sub-pixel bugs!
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
									{ item.name.value } | { iupm.itemUnitPricingMethodName.value }
								</p>
							</div>

							<div className="flex items-center gap-0.5 overflow-hidden">
								<p className="text-[7pt] font-bold leading-none text-center mt-auto pt-0.5">
									{ iupm.price.value.toLocaleString(undefined, {maximumFractionDigits: 0}) }
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