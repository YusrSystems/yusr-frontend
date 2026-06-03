import { ScanBarcode } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, NumberFieldOld } from "yusr-ui";
import type Item from "../../core/data/item";
import type { ItemUnitPricingMethod } from "../../core/data/item";
import ReportConstants from "../../core/data/report/reportConstants";
import { useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemBarcodeButton({ item, iupm }: { item: Item; iupm: ItemUnitPricingMethod; })
{
  const { t, i18n } = useTranslation("erpCommon");
  const { t: tStocking } = useTranslation("stocking");
  const [isOpen, setIsOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [pages, setPages] = useState<number>(1);
  const [barcodesQtn, setBarcodesQtn] = useState<number>(40);
  const authState = useAppSelector((state) => state.auth);

  const onOpen = () =>
  {
    if (iupm.barcode)
    {
      setIsOpen(true);
    }
    else
    {
      setIsErrorOpen(true);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={ onOpen }>
        <ScanBarcode />
      </Button>

      <Dialog open={ isErrorOpen } onOpenChange={ setIsErrorOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("reports.itemBarcode") }</DialogTitle>
            <DialogDescription>{ item.name } - { iupm.itemUnitPricingMethodName }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3 py-4 text-center text-red-600">
            <ScanBarcode className="w-10 h-10" />
            <p className="text-sm">{ tStocking("items.noBarcodeAssigned") }</p>
          </div>

          <DialogFooter>
            <DialogClose />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("reports.itemBarcode") }</DialogTitle>
            <DialogDescription>{ item.name } - { iupm.itemUnitPricingMethodName }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <NumberFieldOld
              label={ t("reports.barcodeCount") }
              min={ 1 }
              step={ 1 }
              value={ barcodesQtn }
              onChange={ (num) => num && setBarcodesQtn(num) }
            />

            <NumberFieldOld
              label={ t("reports.pagesCount") }
              value={ pages }
              onChange={ (num) =>
              {
                if (num == undefined)
                {
                  return;
                }

                setPages(num);
                setBarcodesQtn(num * 40);
              } }
            />
          </div>
          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemBarcode }
              request={ {
                barcode: iupm.barcode ?? "",
                companyName: authState.setting?.companyName,
                itemName: item.name,
                iupmName: iupm.itemUnitPricingMethodName,
                price: iupm.price,
                barcodesQtn: barcodesQtn,
                currency: authState.setting?.currency?.name
              } }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
