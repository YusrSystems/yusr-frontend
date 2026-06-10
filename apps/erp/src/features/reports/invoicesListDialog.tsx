import ClientsAndSuppliersSearchableSelect from "@/core/components/searchableSelect/clientsAndSuppliersSearchableSelect";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect";
import StoresSearchableSelectOld from "@/core/components/searchableSelect/storesSearchableSelectOld";
import type Account from "@/core/data/account";
import { InvoiceType } from "@/core/data/invoice";
import type ItemOld from "@/core/data/itemOld";
import type StoreOld from "@/core/data/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormFieldOld } from "yusr-ui";
import { InvoicesListReportRequest, InvoicesListReportType } from "../../core/data/report/invoicesListReportType";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function InvoicesListDialog()
{
  const { t, i18n } = useTranslation(["erpCommon", "accounting"]);
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(() =>
  {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [toDate, setToDate] = useState<Date>(new Date());
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [store, setStore] = useState<StoreOld | undefined>(undefined);
  const [items, setItems] = useState<ItemOld[]>([]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("reports.create") }
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{ t("reports.InvoicesList") }</DialogTitle>
            <DialogDescription>{ t("reports.InvoicesListDescription") }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex gap-3">
              <DateField
                label={ t("reports.fromDate") }
                value={ fromDate }
                onChange={ (date) => date && setFromDate(date) }
              />
              <DateField
                label={ t("reports.toDate") }
                value={ toDate }
                onChange={ (date) => date && setToDate(date) }
              />
            </div>

            <FormFieldOld label={ t("accounting:invoices.store") }>
              <StoresSearchableSelectOld
                showNullOption
                selectedId={ store?.id }
                selectedLabel={ store?.name }
                onValueChange={ (store) => setStore(store) }
              />
            </FormFieldOld>

            <FormFieldOld label={ t("accounting:invoices.account") }>
              <ClientsAndSuppliersSearchableSelect
                showNullOption
                selectedId={ account?.id }
                selectedLabel={ account?.name }
                onValueChange={ (account) => setAccount(account) }
              />
            </FormFieldOld>

            <FormFieldOld label={ t("sidebar.items") }>
              <ItemsSearchableSelect
                showNullOption
                selectedId={ undefined }
                selectedLabel={ undefined }
                onValueChange={ (item) =>
                {
                  if (item && !items.some((i) => i.id === item.id))
                  {
                    setItems((prev) => [...prev, item]);
                  }
                } }
              />
              { items.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  { items.map((item) => (
                    <span
                      key={ item.id }
                      className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-foreground"
                    >
                      { item.name }
                      <button
                        type="button"
                        className="text-destructive text-sm font-semibold hover:text-foreground"
                        onClick={ () => setItems((prev) => prev.filter((i) => i.id !== item.id)) }
                      >
                        ×
                      </button>
                    </span>
                  )) }
                </div>
              ) }
            </FormFieldOld>
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.InvoicesList }
              request={ new InvoicesListReportRequest({
                fromDate: fromDate?.toLocaleDateString("en-CA") ?? null,
                toDate: toDate?.toLocaleDateString("en-CA") ?? null,
                reportType: InvoicesListReportType.ProfitAndLoss,
                types: [InvoiceType.Sell, InvoiceType.SellReturn, InvoiceType.Purchase, InvoiceType.PurchaseReturn],
                actionAccountId: account?.id,
                storeId: store?.id,
                itemIds: items.map((i) => i.id)
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
