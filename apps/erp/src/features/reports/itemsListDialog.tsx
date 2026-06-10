import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { ItemType } from "@/core/data/itemOld";
import { ItemsListReportRequest } from "@/core/data/report/itemsListReportRequest";
import { Store } from "@/core/data/store";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormFieldOld, SelectField, TextField } from "yusr-ui";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function ItemsListDialog({ store, buttonLabel }: { store?: Store; buttonLabel?: string; })
{
  useSignals();
  const { t, i18n } = useTranslation(["erpCommon", "stocking", "accounting", "common"]);
  const isOpen = useMemo(() => signal<boolean>(false), []);
  const itemType = useMemo(() => signal<ItemType | undefined>(undefined), []);
  const itemClass = useMemo(() => signal<string | undefined>(undefined), []);
  const brand = useMemo(() => signal<string | undefined>(undefined), []);
  const selectedStore = useMemo(() => signal<Store>(store ?? Store.create({ id: undefined, name: "" })), []);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
        { buttonLabel ?? t("reports.create") }
      </Button>
      <Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{ t("reports.itemsList") }</DialogTitle>
            <DialogDescription>{ t("reports.itemsListDescription") }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <SelectField<number>
              label={ t("stocking:items.itemType") }
              value={ itemType }
              options={ [{ label: t("common:searchableSelect.nullOption"), value: undefined }, {
                label: t("stocking:items.product"),
                value: ItemType.Product
              }, {
                label: t("stocking:items.service"),
                value: ItemType.Service
              }] }
            />

            <FormFieldOld label={ t("accounting:invoices.store") }>
              <StoresSearchableSelect
                id={ selectedStore.value?.id }
                label={ selectedStore.value?.name }
              />
            </FormFieldOld>

            <TextField
              label={ t("stocking:items.class") }
              value={ itemClass }
            />
            <TextField
              label={ t("stocking:items.brand") }
              value={ brand }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemsList }
              request={ new ItemsListReportRequest({
                itemType: itemType.value,
                class: itemClass.value,
                brand: brand.value,
                storeId: selectedStore.value?.id.value,
                storeName: selectedStore.value?.name.value
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
