import StoresSearchableSelectOld from "@/core/components/searchableSelect/storesSearchableSelectOld";
import type Item from "@/core/data/item";
import { useSignals } from "@preact/signals-react/runtime";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormFieldOld } from "yusr-ui";
import ReportConstants from "../../core/data/report/reportConstants";
import StoreOld from "../../core/data/store";
import ReportButton from "./reportButton";

export default function ItemStatementButton({ item }: { item: Item; })
{
  useSignals();
  const { t, i18n } = useTranslation("erpCommon");

  const [isOpen, setIsOpen] = useState(false);
  const [store, setStore] = useState<StoreOld | undefined>(undefined);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("itemStatement.button") }
      </Button>

      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("itemStatement.title") }</DialogTitle>
            <DialogDescription>{ item.name.value }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <FormFieldOld label={ t("itemStatement.store") }>
              <StoresSearchableSelectOld
                showNullOption
                selectedId={ store?.id }
                selectedLabel={ store?.name }
                onValueChange={ (store) => setStore(store) }
              />
            </FormFieldOld>
          </div>
          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemStatement }
              request={ { itemId: item.id.value, storeId: store?.id } }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
