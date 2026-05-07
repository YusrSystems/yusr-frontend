import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Button, SaveButton } from "yusr-ui";
import type Invoice from "../../../../core/data/invoice";
import type { InvoiceVoucher } from "../../../../core/data/invoice";
import InvoicesApiService from "../../../../core/networking/invoiceApiService";

type AlertConvertDialogProps = {
  invoiceId: number;
  createInitialPaymentVoucher: () => InvoiceVoucher;
  onSuccess: (data: Invoice) => void;
};

export default function AlertConvertDialog(
  { invoiceId, createInitialPaymentVoucher, onSuccess }: AlertConvertDialogProps
)
{
  const { t, i18n } = useTranslation("accounting");
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        className="ml-10"
        onClick={ () => setShowConfirm(true) }
      >
        { t("invoices.convertToSell") }
      </Button>

      <AlertDialog open={ showConfirm } onOpenChange={ setShowConfirm }>
        <AlertDialogContent dir={ i18n.dir() }>
          <AlertDialogHeader>
            <AlertDialogTitle>{ t("invoices.confirmConversion") }</AlertDialogTitle>
            <AlertDialogDescription>
              { t("invoices.conversionWarning") }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{ t("invoices.cancel") }</AlertDialogCancel>
            <SaveButton<Invoice>
              formData={ {} }
              label={ t("invoices.confirm") }
              variant="destructive"
              onExecute={ async (_, ignoreWarnings) =>
              {
                return await new InvoicesApiService().ConvertToSell(invoiceId, ignoreWarnings, [
                  createInitialPaymentVoucher()
                ]);
              } }
              onSuccess={ (newData) =>
              {
                setShowConfirm(false);
                onSuccess(newData);
              } }
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
