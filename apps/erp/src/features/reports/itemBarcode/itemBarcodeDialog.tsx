import { Printer, ScanBarcode } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	NumberField
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import type Item from "@/core/data/item.ts";
import {
	printBarcodesQtn,
	printItem,
	printItemPrice,
	printItemUoM
} from "@/features/reports/itemBarcode/itemBarcodePrintState.ts";
import type { ItemUoM } from "@/core/data/itemUoM.ts";
import type { ItemPrice } from "@/core/data/itemPrice.ts";


export default function ItemBarcodeButton({item, itemUoM, itemPrice}: {
	item: Item;
	itemUoM: ItemUoM;
	itemPrice: ItemPrice
})
{
	useSignals();

	const {t, i18n} = useTranslation("erpCommon");
	const {t: tStocking} = useTranslation("stocking");
	const isOpen = useMemo(() => signal(false), []);
	const isErrorOpen = useMemo(() => signal(false), []);
	const pages = useMemo(() => signal(1), []);
	const barcodesQtn = useMemo(() => signal(40), []);
	const originalTitle = document.title;

	const onOpen = () =>
	{
		if (itemUoM.barcode.value)
		{
			isOpen.value = true;
		}
		else
		{
			isErrorOpen.value = true;
		}
	};

	const onPrint = () =>
	{
		isOpen.value = false;

		printItem.value = item;
		printItemUoM.value = itemUoM;
		printItemPrice.value = itemPrice;
		printBarcodesQtn.value = barcodesQtn.value;
		document.title = `باركود - ${ item.name.value } - ${ itemUoM.barcode.value }`;

		requestAnimationFrame(() =>
		{
			requestAnimationFrame(() =>
			{
				window.print();
			});
		});
	};

	useEffect(() =>
	{
		const handleAfterPrint = () =>
		{
			printItem.value = undefined;
			printItemUoM.value = undefined;
			printItemPrice.value = undefined;
			document.title = originalTitle;
		};
		window.addEventListener("afterprint", handleAfterPrint);
		return () => window.removeEventListener("afterprint", handleAfterPrint);
	}, []);

	return (
		<>
			<Button variant="outline" onClick={ onOpen }>
				<Printer/>
				طباعة الباركود
			</Button>

			<Dialog open={ isErrorOpen.value } onOpenChange={ (open) => isErrorOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("reports.itemBarcode") }</DialogTitle>
						<DialogDescription>{ item.name.value } - { itemUoM.unitName.value }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col items-center gap-3 py-4 text-center text-red-600">
						<ScanBarcode className="w-10 h-10"/>
						<p className="text-sm">{ tStocking("items.noBarcodeAssigned") }</p>
					</div>

					<DialogFooter>
						<DialogClose/>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("reports.itemBarcode") }</DialogTitle>
						<DialogDescription>{ item.name.value } - { itemUoM.unitName.value }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<NumberField
							label={ t("reports.barcodeCount") }
							min={ 1 }
							step={ 1 }
							value={ barcodesQtn }
						/>

						<NumberField
							label={ t("reports.pagesCount") }
							value={ pages }
							onChange={ () => barcodesQtn.value = pages.value * 40 }
						/>
					</div>
					<DialogFooter>
						<Button onClick={ onPrint }>
							<Printer className="h-4 w-4 me-2"/>
							{ t("reports.create") }
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}