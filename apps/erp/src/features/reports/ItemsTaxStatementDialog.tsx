import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormFieldOld, SelectField } from "yusr-ui";
import Item from "../../core/data/item";
import { ItemsTaxStatementReportRequest, ItemsTaxStatementReportType } from "../../core/data/report/itemsTaxStatementReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function ItemsTaxStatementDialog()
{
  const { t, i18n } = useTranslation("erpCommon");
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ItemsTaxStatementReportType>(ItemsTaxStatementReportType.Sales);
  const [item, setItem] = useState<Item | undefined>(undefined);
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
            <FormFieldOld label={ t("reports.item") } required={ true }>
              <ItemsSearchableSelect
                showNullOption
                selectedId={ item?.id }
                selectedLabel={ item?.name }
                onValueChange={ (item) => setItem(item) }
              />
            </FormFieldOld>
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
                itemId: item?.id ?? null,
                type: type
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
