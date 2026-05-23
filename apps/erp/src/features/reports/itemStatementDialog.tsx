import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField } from "yusr-ui";
import type Item from "../../core/data/item";
import ReportConstants from "../../core/data/report/reportConstants";
import Store from "../../core/data/store";
import ReportButton from "./reportButton";

export default function ItemStatementButton({ item }: { item: Item; })
{
  const { t, i18n } = useTranslation("erpCommon");

  const [isOpen, setIsOpen] = useState(false);
  const [store, setStore] = useState<Store | undefined>(undefined);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("itemStatement.button") }
      </Button>

      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("itemStatement.title") }</DialogTitle>
            <DialogDescription>{ item.name }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <FormField label={ t("itemStatement.store") }>
              <StoresSearchableSelect
                showAllOption
                selectedId={ store?.id }
                selectedLabel={ store?.name }
                onValueChange={ (store) => setStore(store) }
              />
            </FormField>
          </div>
          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemStatement }
              request={ { itemId: item.id, storeId: store?.id } }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
