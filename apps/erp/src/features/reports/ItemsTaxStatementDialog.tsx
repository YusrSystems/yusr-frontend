import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, SearchableSelect, SelectField } from "yusr-ui";
import { ItemFilterColumns, ItemSlice } from "../../core/data/item";
import { ItemsTaxStatementReportRequest, ItemsTaxStatementReportType } from "../../core/data/report/itemsTaxStatementReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemsTaxStatementDialog()
{
  const { t, i18n } = useTranslation("erpCommon");
  const { t: tStocking } = useTranslation("stocking");
  const dispatch = useAppDispatch();
  const itemState = useAppSelector((state) => state.item);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ItemsTaxStatementReportType>(ItemsTaxStatementReportType.Sales);
  const [itemId, setItemId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("reports.create") }
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("reports.itemsTaxStatement") }</DialogTitle>
            <DialogDescription>{ t("reports.itemsTaxStatementDescription") }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <SelectField
              label={ t("reports.invoiceType") }
              required
              value={ type.toString() || "" }
              onValueChange={ (val) => setType(Number(val) as ItemsTaxStatementReportType) }
              options={ [{ label: t("reports.salesTaxReport"), value: ItemsTaxStatementReportType.Sales.toString() }, {
                label: t("reports.purchasesTaxReport"),
                value: ItemsTaxStatementReportType.Purchases.toString()
              }] }
            />
            <FormField label={ t("reports.item") } required={ true }>
              <SearchableSelect
                items={ itemState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                showAllOption
                value={ itemId?.toString() || "" }
                onValueChange={ (val) => setItemId(Number(val)) }
                columnsNames={ ItemFilterColumns.columnsNames(tStocking) }
                onSearch={ (condition) => dispatch(ItemSlice.entityActions.filter(condition)) }
                isLoading={ itemState.isLoading }
                disabled={ itemState.isLoading }
              />
            </FormField>
            <DateField
              label={ t("reports.fromDate") }
              value={ fromDate ?? undefined }
              onChange={ (date) => setFromDate(date ?? undefined) }
            />
            <DateField
              label={ t("reports.toDate") }
              value={ toDate ?? undefined }
              onChange={ (date) => setToDate(date ?? undefined) }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemTaxStatement }
              request={ new ItemsTaxStatementReportRequest({
                fromDate: fromDate?.toLocaleDateString("en-CA") ?? null,
                toDate: toDate?.toLocaleDateString("en-CA") ?? null,
                itemId: itemId,
                type: type
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
