import { useState } from "react";
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
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        className="ml-10"
        onClick={ () => setShowConfirm(true) }
      >
        تحويل لفاتورة بيع
      </Button>

      <AlertDialog open={ showConfirm } onOpenChange={ setShowConfirm }>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد التحويل</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من تحويل عرض السعر إلى فاتورة بيع؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <SaveButton<Invoice>
              formData={ {} }
              label="تأكيد"
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
