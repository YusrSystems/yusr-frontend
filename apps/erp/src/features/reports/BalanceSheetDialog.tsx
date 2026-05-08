import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "yusr-ui";
import { BalanceSheetReportRequest } from "../../core/data/report/balanceSheetReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function BalanceSheetDialog()
{
  const { t, i18n } = useTranslation("erpCommon");
  const [isOpen, setIsOpen] = useState(false);
  const [toDate, setToDate] = useState<Date>(new Date());

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("reports.create") }
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("reports.balanceSheet") }</DialogTitle>
            <DialogDescription>{ t("reports.balanceSheetDescription") }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <DateField
              label={ t("reports.toDate") }
              value={ toDate }
              onChange={ (date) => date && setToDate(date) }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.BalanceSheet }
              request={ new BalanceSheetReportRequest({ toDate }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
