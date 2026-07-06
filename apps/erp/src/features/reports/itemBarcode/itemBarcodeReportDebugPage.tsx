import Item from "@/core/data/item";
import { ItemUnitPricingMethod } from "@/core/data/itemUnitPricingMethod";
import { ItemBarcodeReport } from "@/features/reports/itemBarcode/itemBarcodeReport.tsx";


export function ItemBarcodeReportDebugPage()
{
	const item = new Item({
		id: 999,
		name: "Test Item"
	});

	const iupm = new ItemUnitPricingMethod({
		id: 1,
		itemUnitPricingMethodName: "خدمة | test",
		barcode: "23HK39R6FQQH",
		price: 120
	});

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="print:hidden mb-4 px-4">
				<button
					onClick={ () => window.print() }
					className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
				>
					Print
				</button>
			</div>

			<ItemBarcodeReport
				item={ item }
				iupm={ iupm }
				barcodesQtn={ 20 }
				isPortal={ false }
			/>
		</div>
	);
}