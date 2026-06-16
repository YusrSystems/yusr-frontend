import type Item from "@/core/data/item";
import { ScanBarcode } from "lucide-react";
import { useMemo } from "react";
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
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import type { ItemUnitPricingMethod } from "@/core/data/itemUnitPricingMethod";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services.ts";
import { ItemBarcodeRequest } from "@/core/data/report/itemBarcodeRequest.ts";


export default function ItemBarcodeButton({item, iupm}: { item: Item; iupm: ItemUnitPricingMethod; })
{
	useSignals();
	const {t, i18n} = useTranslation("erpCommon");
	const {t: tStocking} = useTranslation("stocking");

	const isOpen = useMemo(() => signal(false), []);
	const isErrorOpen = useMemo(() => signal(false), []);
	const pages = useMemo(() => signal(1), []);
	const barcodesQtn = useMemo(() => signal(40), []);

	const onOpen = () =>
	{
		if (iupm.barcode.value)
		{
			isOpen.value = true;
		}
		else
		{
			isErrorOpen.value = true;
		}
	};

	return (
		<>
			<Button variant="ghost" size="sm" onClick={ onOpen }>
				<ScanBarcode/>
			</Button>

			<Dialog open={ isErrorOpen.value } onOpenChange={ (open) => isErrorOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("reports.itemBarcode") }</DialogTitle>
						<DialogDescription>{ item.name.value } - { iupm.itemUnitPricingMethodName.value }</DialogDescription>
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
						<DialogDescription>{ item.name.value } - { iupm.itemUnitPricingMethodName.value }</DialogDescription>
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
						<ReportButton
							reportName={ ReportConstants.ItemBarcode }
							request={ new ItemBarcodeRequest({
								barcode: iupm.barcode.value ?? "",
								companyName: Services.auth.setting?.companyName.value,
								itemName: item.name.value,
								iupmName: iupm.itemUnitPricingMethodName.value,
								price: iupm.price.value,
								barcodesQtn: barcodesQtn.value,
								currency: Services.auth.setting?.currency?.value?.name.value
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
