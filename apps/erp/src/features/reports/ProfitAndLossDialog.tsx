import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "yusr-ui";
import { InvoicesListReportRequest, InvoicesListReportType } from "../../core/data/report/invoicesListReportType";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function ProfitAndLossDialog()
{
  const { t, i18n } = useTranslation("erpCommon");
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(() =>
  {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [toDate, setToDate] = useState<Date>(new Date());

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("reports.create") }
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("reports.profitAndLoss") }</DialogTitle>
            <DialogDescription>{ t("reports.profitAndLossDescription") }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
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

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.InvoicesList }
              request={ new InvoicesListReportRequest({
                fromDate: fromDate?.toLocaleDateString("en-CA") ?? null,
                toDate: toDate?.toLocaleDateString("en-CA") ?? null,
                reportType: InvoicesListReportType.ProfitAndLoss
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
