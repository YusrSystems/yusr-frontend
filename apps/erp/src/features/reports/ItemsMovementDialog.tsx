import ClientsAndSuppliersSearchableSelect from "@/core/components/searchableSelect/clientsAndSuppliersSearchableSelect";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect";
import StoresSearchableSelectOld from "@/core/components/searchableSelect/storesSearchableSelectOld";
import type Account from "@/core/data/account";
import type ItemOld from "@/core/data/itemOld";
import type StoreOld from "@/core/data/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormFieldOld, SelectFieldOld } from "yusr-ui";
import { ItemsMovementReportGroupOption, ItemsMovementReportRequest, ItemsMovementReportTransType } from "../../core/data/report/itemsMovementReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function ItemsMovementDialog()
{
  const { t, i18n } = useTranslation("erpCommon");

  const [isOpen, setIsOpen] = useState(false);
  const [transTypeId, setTransTypeId] = useState<ItemsMovementReportTransType | undefined>(undefined);
  const [item, setItem] = useState<ItemOld | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromAccount, setFromAccount] = useState<Account | undefined>(undefined);
  const [toAccount, setToAccount] = useState<Account | undefined>(undefined);
  const [fromStore, setFromStore] = useState<StoreOld | undefined>(undefined);
  const [toStore, setToStore] = useState<StoreOld | undefined>(undefined);
  const [groupOption, setGroupOption] = useState<ItemsMovementReportGroupOption | undefined>(undefined);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("reports.create") }
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{ t("reports.itemsMovement") }</DialogTitle>
            <DialogDescription>{ t("reports.itemsMovementDescription") }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <SelectFieldOld
              label={ t("reports.movementType") }
              value={ transTypeId?.toString() ?? "" }
              onValueChange={ (val) => setTransTypeId(val ? Number(val) as ItemsMovementReportTransType : undefined) }
              options={ [
                { label: t("reports.sell"), value: ItemsMovementReportTransType.Sell.toString() },
                { label: t("reports.purchase"), value: ItemsMovementReportTransType.Purchase.toString() },
                { label: t("reports.sellReturn"), value: ItemsMovementReportTransType.SellReturn.toString() },
                { label: t("reports.purchaseReturn"), value: ItemsMovementReportTransType.PurchaseReturn.toString() },
                { label: t("reports.transfer"), value: ItemsMovementReportTransType.Transfer.toString() },
                { label: t("reports.settlement"), value: ItemsMovementReportTransType.Settlement.toString() }
              ] }
            />

            <FormFieldOld label={ t("reports.item") }>
              <ItemsSearchableSelect
                showNullOption
                selectedId={ item?.id }
                selectedLabel={ item?.name }
                onValueChange={ (item) => setItem(item) }
              />
            </FormFieldOld>

            <div className="grid grid-cols-2 gap-3">
              <DateField
                label={ t("reports.fromDate") }
                value={ fromDate }
                onChange={ (date) => setFromDate(date ?? undefined) }
              />
              <DateField
                label={ t("reports.toDate") }
                value={ toDate }
                onChange={ (date) => setToDate(date ?? undefined) }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldOld label={ t("reports.fromAccount") }>
                <ClientsAndSuppliersSearchableSelect
                  showNullOption
                  selectedId={ fromAccount?.id }
                  selectedLabel={ fromAccount?.name }
                  onValueChange={ (account) => setFromAccount(account) }
                />
              </FormFieldOld>

              <FormFieldOld label={ t("reports.toAccount") }>
                <ClientsAndSuppliersSearchableSelect
                  showNullOption
                  selectedId={ toAccount?.id }
                  selectedLabel={ toAccount?.name }
                  onValueChange={ (account) => setToAccount(account) }
                />
              </FormFieldOld>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldOld label={ t("reports.fromStore") }>
                <StoresSearchableSelectOld
                  showNullOption
                  selectedId={ fromStore?.id }
                  selectedLabel={ fromStore?.name }
                  onValueChange={ (store) => setFromStore(store) }
                />
              </FormFieldOld>

              <FormFieldOld label={ t("reports.toStore") }>
                <StoresSearchableSelectOld
                  showNullOption
                  selectedId={ toStore?.id }
                  selectedLabel={ toStore?.name }
                  onValueChange={ (store) => setToStore(store) }
                />
              </FormFieldOld>
            </div>

            <SelectFieldOld
              label={ t("reports.groupBy") }
              value={ groupOption?.toString() ?? "" }
              onValueChange={ (val) => setGroupOption(val ? Number(val) as ItemsMovementReportGroupOption : undefined) }
              options={ [
                { label: t("reports.item"), value: ItemsMovementReportGroupOption.Item.toString() },
                { label: t("reports.from"), value: ItemsMovementReportGroupOption.From.toString() },
                { label: t("reports.to"), value: ItemsMovementReportGroupOption.To.toString() },
                { label: t("reports.day"), value: ItemsMovementReportGroupOption.Day.toString() },
                { label: t("reports.month"), value: ItemsMovementReportGroupOption.Month.toString() },
                { label: t("reports.year"), value: ItemsMovementReportGroupOption.Year.toString() }
              ] }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemsMovement }
              request={ new ItemsMovementReportRequest({
                transTypeId: transTypeId ?? null,
                itemId: item?.id ?? null,
                fromDate: fromDate?.toLocaleDateString("en-CA") ?? null,
                toDate: toDate?.toLocaleDateString("en-CA") ?? null,
                fromAccountId: fromAccount?.id ?? null,
                toAccountId: toAccount?.id ?? null,
                fromStoreId: fromStore?.id ?? null,
                toStoreId: toStore?.id ?? null,
                groupOption: groupOption ?? null
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
