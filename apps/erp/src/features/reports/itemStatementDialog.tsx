import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, SearchableSelect } from "yusr-ui";
import type Item from "../../core/data/item";
import ReportConstants from "../../core/data/report/reportConstants";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemStatementButton({ item }: { item: Item; })
{
  const dispatch = useAppDispatch();
  const storeState = useAppSelector((state) => state.store);
  const { t, i18n } = useTranslation("erpCommon");
  const { t: tStocking } = useTranslation("stocking");

  const [isOpen, setIsOpen] = useState(false);
  const [storeId, setStoreId] = useState<number | undefined>(undefined);

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
              <SearchableSelect
                items={ storeState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                showAllOption
                value={ storeId?.toString() || "" }
                onValueChange={ (val) => setStoreId(Number(val)) }
                columnsNames={ StoreFilterColumns.columnsNames(tStocking) }
                onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
                isLoading={ storeState.isLoading }
                disabled={ storeState.isLoading }
              />
            </FormField>
          </div>
          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemStatement }
              request={ { itemId: item.id, storeId: storeId } }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
