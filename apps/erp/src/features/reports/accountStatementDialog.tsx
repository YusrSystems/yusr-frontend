import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "yusr-ui";
import type Account from "../../core/data/account";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function AccountStatementButton({ account }: { account: Account; })
{
  const { t, i18n } = useTranslation("erpCommon");
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        { t("accountStatement.button") }
      </Button>

      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{ t("accountStatement.title") }</DialogTitle>
            <DialogDescription>{ account.name }</DialogDescription>
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
              reportName={ ReportConstants.AccountStatement }
              request={ { accountId: account.id, fromDate, toDate } }
            >
            </ReportButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
