import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, SearchableSelect, SelectField } from "yusr-ui";
import { AccountFilterColumns, ClientsAndSuppliersSlice } from "../../core/data/account";
import { ItemFilterColumns, ItemSlice } from "../../core/data/item";
import { ItemsMovementReportGroupOption, ItemsMovementReportRequest, ItemsMovementReportTransType } from "../../core/data/report/itemsMovementReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemsMovementDialog()
{
  const dispatch = useAppDispatch();
  const itemState = useAppSelector((state) => state.item);
  const accountState = useAppSelector((state) => state.clientsAndSuppliers);
  const storeState = useAppSelector((state) => state.store);
  const { t, i18n } = useTranslation("erpCommon");
  const { t: tStocking } = useTranslation("stocking");
  const { t: tAccounting } = useTranslation("accounting");

  const [isOpen, setIsOpen] = useState(false);
  const [transTypeId, setTransTypeId] = useState<ItemsMovementReportTransType | undefined>(undefined);
  const [itemId, setItemId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromAccountId, setFromAccountId] = useState<number | undefined>(undefined);
  const [toAccountId, setToAccountId] = useState<number | undefined>(undefined);
  const [fromStoreId, setFromStoreId] = useState<number | undefined>(undefined);
  const [toStoreId, setToStoreId] = useState<number | undefined>(undefined);
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
            <SelectField
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

            <FormField label={ t("reports.item") }>
              <SearchableSelect
                items={ itemState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                showAllOption
                value={ itemId?.toString() ?? "" }
                onValueChange={ (val) => setItemId(val ? Number(val) : undefined) }
                columnsNames={ ItemFilterColumns.columnsNames(tStocking) }
                onSearch={ (condition) => dispatch(ItemSlice.entityActions.filter(condition)) }
                isLoading={ itemState.isLoading }
                disabled={ itemState.isLoading }
              />
            </FormField>

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
              <FormField label={ t("reports.fromAccount") }>
                <SearchableSelect
                  items={ accountState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ fromAccountId?.toString() ?? "" }
                  onValueChange={ (val) => setFromAccountId(val ? Number(val) : undefined) }
                  columnsNames={ AccountFilterColumns.columnsNames(tAccounting) }
                  onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
                  isLoading={ accountState.isLoading }
                  disabled={ accountState.isLoading }
                />
              </FormField>

              <FormField label={ t("reports.toAccount") }>
                <SearchableSelect
                  items={ accountState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ toAccountId?.toString() ?? "" }
                  onValueChange={ (val) => setToAccountId(val ? Number(val) : undefined) }
                  columnsNames={ AccountFilterColumns.columnsNames(tAccounting) }
                  onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
                  isLoading={ accountState.isLoading }
                  disabled={ accountState.isLoading }
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={ t("reports.fromStore") }>
                <SearchableSelect
                  items={ storeState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ fromStoreId?.toString() ?? "" }
                  onValueChange={ (val) => setFromStoreId(val ? Number(val) : undefined) }
                  columnsNames={ StoreFilterColumns.columnsNames(tStocking) }
                  onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
                  isLoading={ storeState.isLoading }
                  disabled={ storeState.isLoading }
                />
              </FormField>

              <FormField label={ t("reports.toStore") }>
                <SearchableSelect
                  items={ storeState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ toStoreId?.toString() ?? "" }
                  onValueChange={ (val) => setToStoreId(val ? Number(val) : undefined) }
                  columnsNames={ StoreFilterColumns.columnsNames(tStocking) }
                  onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
                  isLoading={ storeState.isLoading }
                  disabled={ storeState.isLoading }
                />
              </FormField>
            </div>

            <SelectField
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
                itemId: itemId ?? null,
                fromDate: fromDate?.toLocaleDateString("en-CA") ?? null,
                toDate: toDate?.toLocaleDateString("en-CA") ?? null,
                fromAccountId: fromAccountId ?? null,
                toAccountId: toAccountId ?? null,
                fromStoreId: fromStoreId ?? null,
                toStoreId: toStoreId ?? null,
                groupOption: groupOption ?? null
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
