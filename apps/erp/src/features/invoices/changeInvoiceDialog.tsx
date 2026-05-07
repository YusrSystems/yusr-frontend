import { BanknoteArrowDown, BanknoteArrowUp, Box, CheckCircle2, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps, DialogMode, IEntityState } from "yusr-ui";
import { Button, ChangeDialogTabbed, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FilterByTypeRequest, Loading, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import Account, { type AccountSliceType } from "../../core/data/account";
import type Invoice from "../../core/data/invoice";
import { InvoiceRelationType, InvoiceSlice, InvoiceStatus, InvoiceType, InvoiceValidationRules, InvoiceVoucher } from "../../core/data/invoice";
import { ItemType } from "../../core/data/item";
import { PaymentMethodSlice } from "../../core/data/paymentMethod";
import { StoreSlice } from "../../core/data/store";
import InvoicesApiService from "../../core/networking/invoiceApiService";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import { InvoiceContext } from "./logic/invoiceContext";
import InvoiceItemsMath from "./logic/invoiceItemsMath";
import InvoiceBasicTab from "./presentation/basic/invoiceBasicTab";
import InvoiceCostsTab from "./presentation/costs/invoiceCostsTab";
import AlertConvertDialog from "./presentation/dialogs/alertConvertDialog";
import InvoiceFilesTab from "./presentation/files/invoiceFilesTab";
import InvoicePaymentsTab from "./presentation/payments/invoicePaymentsTab";
import InvoicePolicyTab from "./presentation/policy/invoicePolicyTab";

export type InvoiceSliceType = ReturnType<typeof InvoiceSlice.create>;
export type InvoiceDialogMode = DialogMode | "return";

export default function ChangeInvoiceDialog({
  entity,
  mode,
  service,
  onSuccess,
  slice,
  fixedType,
  selectFormState,
  accountSlice,
  accountState
}: Omit<CommonChangeDialogProps<Invoice>, "mode" | "onSuccess"> & {
  mode: InvoiceDialogMode;
  onSuccess?: (data: Invoice, mode: InvoiceDialogMode) => void;
  slice: InvoiceSliceType;
  stateKey: keyof RootState;
  fixedType?: InvoiceType;
  selectFormState: (state: any) => { formData: Partial<Invoice>; errors: Record<string, string>; };
  accountSlice: AccountSliceType;
  accountState: IEntityState<Account>;
})
{
  const { t, i18n } = useTranslation("accounting");
  const [initLoading, setInitLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const invoiceTaxInclusivePrice = () => InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(formData?.invoiceItems ?? []);

  const initialValues = useMemo(
    () => ({
      ...entity,
      type: entity?.type ?? fixedType,
      actionAccountId: entity?.actionAccountId
        ?? ((entity?.type ?? fixedType) === InvoiceType.Purchase
          ? authState.setting?.purchaseAccountId
          : authState.setting?.sellAccountId),
      actionAccountName: entity?.actionAccountName
        ?? ((entity?.type ?? fixedType) === InvoiceType.Purchase
          ? authState.setting?.purchaseAccountName
          : authState.setting?.sellAccountName),
      storeId: entity?.storeId ?? authState.setting?.mainStoreId,
      storeName: entity?.storeName ?? authState.setting?.mainStoreName,
      statusId: entity?.statusId ?? InvoiceStatus.Valid,
      date: entity?.date
        ? new Date(entity.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      settlementAmount: entity?.settlementAmount ?? 0,
      settlementPercent: entity?.settlementPercent ?? 0,
      paidAmount: entity?.paidAmount ?? 0,
      fullAmount: entity?.fullAmount ?? 0,
      invoiceItems: entity?.invoiceItems ?? [],
      invoiceVouchers: entity?.invoiceVouchers ?? []
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector(selectFormState);
  const { getError, isInvalid } = useFormErrors(errors);
  const [fullyReturned, setFullyReturned] = useState(false);

  const paymentVouchers = () =>
    formData.invoiceVouchers?.filter((v) => v.invoiceRelationType == InvoiceRelationType.Payment) ?? [];
  const { validate } = useValidate(
    formData,
    InvoiceValidationRules.validationRules(t),
    (errors) => dispatch(slice.formActions.setErrors(errors))
  );
  useFormInit(slice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(accountSlice.entityActions.filter());
    dispatch(PaymentMethodSlice.entityActions.filter());
    dispatch(StoreSlice.entityActions.filter());
  }, [dispatch]);

  useEffect(() =>
  {
    if (formData.storeId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        storeId: formData.type === InvoiceType.Purchase ? undefined : formData.storeId ?? 0,
        request: new FilterByTypeRequest({ condition: undefined, types: [ItemType.Product, ItemType.Service] })
      }));
    }
  }, [dispatch, formData.storeId]);

  useEffect(() =>
  {
    if (paymentVouchers().length > 1 && mode === "update")
    {
      return;
    }

    if (paymentVouchers().length === 0)
    {
      dispatch(slice.formActions.resetPaymentVouchers({}));
      dispatch(slice.formActions.addVoucher(createInitialPaymentVoucher()));
    }
    else if (paymentVouchers().length === 1)
    {
      const voucher = paymentVouchers()[0];
      const updatedVoucher = {
        ...voucher,
        amount: invoiceTaxInclusivePrice(),
        amountReceived: invoiceTaxInclusivePrice(),
        accountId: voucher.accountId === 0 ? formData.actionAccountId : voucher.accountId,
        accountName: voucher.accountId === 0 ? formData.actionAccountName : voucher.accountName
      };
      dispatch(slice.formActions.updateVoucher(updatedVoucher));
    }

    dispatch(
      slice.formActions.updateFormData({
        fullAmount: invoiceTaxInclusivePrice(),
        paidAmount: invoiceTaxInclusivePrice()
      })
    );
  }, [formData.invoiceItems, formData.actionAccountId, accountState.entities.data?.length]);

  useEffect(() =>
  {
    if ((mode === "update" || mode === "return") && entity?.id != undefined)
    {
      setInitLoading(true);

      const getInvoice = async () =>
      {
        let res = undefined;

        if (mode === "update")
        {
          res = await service.Get(entity.id);
        }
        else if (mode === "return")
        {
          res = await new InvoicesApiService().GetReturnInvoiceInitialDetails(entity.id);
        }

        if (res?.data != undefined)
        {
          dispatch(slice.formActions.updateFormData(res.data));
          setFullyReturned(res.data.invoiceItems.length === 0);
        }
        setInitLoading(false);
      };

      getInvoice();
    }
  }, [dispatch, entity?.id]);

  const createInitialPaymentVoucher = (): InvoiceVoucher =>
  {
    return {
      voucherId: 0,
      invoiceId: formData.id ?? 0,
      paymentMethodId: authState.setting?.mainPaymentMethodId ?? 0,
      paymentMethodName: authState.setting?.mainPaymentMethodName ?? "",
      accountId: formData.actionAccountId ?? 0,
      accountName: formData.actionAccountName ?? "",
      invoiceRelationType: InvoiceRelationType.Payment,
      amount: invoiceTaxInclusivePrice(),
      amountReceived: invoiceTaxInclusivePrice(),
      description: undefined
    } as InvoiceVoucher;
  };

  const onBeforeSave = async (): Promise<{ handled: boolean; data?: Invoice; }> =>
  {
    if (mode === "return")
    {
      const res = await new InvoicesApiService().Add({
        ...formData,
        type: formData.type === InvoiceType.Sell ? InvoiceType.SellReturn : InvoiceType.PurchaseReturn,
        originalInvoiceId: formData.id,
        id: 0
      } as Invoice);
      return { handled: true, data: res.data as Invoice ?? undefined };
    }

    return { handled: false };
  };

  const isReturn = formData.type === InvoiceType.SellReturn || formData.type === InvoiceType.PurchaseReturn;

  const getDialogTitle = () =>
  {
    if (mode === "return")
    {
      return t("invoices.addReturnInvoice");
    }
    if (mode === "create")
    {
      return isReturn ? t("invoices.addReturnInvoice") : t("invoices.addInvoice");
    }
    return isReturn ? t("invoices.editReturnInvoice") : t("invoices.editInvoice");
  };

  if (initLoading)
  {
    return (
      <DialogContent dir={ i18n.dir() }>
        <DialogHeader>
          <DialogTitle>{ getDialogTitle() }</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName={ t("invoices.entityName") } />
      </DialogContent>
    );
  }

  if (fullyReturned)
  {
    return (
      <DialogContent dir={ i18n.dir() }>
        <DialogHeader>
          <DialogTitle>{ getDialogTitle() }</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">{ t("invoices.fullyReturned") }</h3>
          <p className="text-sm text-muted-foreground">{ t("invoices.fullyReturnedMessage") }</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{ t("invoices.close") }</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }

  const disabled = mode === "update" && formData.type !== InvoiceType.Quotation;

  return (
    <InvoiceContext.Provider
      value={ {
        formData,
        errors,
        getError,
        isInvalid,
        slice,
        mode,
        authState,
        dispatch,
        disabled,
        accountSlice,
        accountState
      } }
    >
      <ChangeDialogTabbed<Invoice>
        changeDialogProps={ {
          title: getDialogTitle(),
          className: "sm:max-w-[100vw] sm:w-screen sm:h-screen",
          formData,
          dialogMode: mode as DialogMode,
          service,
          onSuccess: (data) => onSuccess?.(data, mode),
          validate,
          onBeforeSave: onBeforeSave,
          actionButtons: formData.type === InvoiceType.Quotation && mode === "update" && formData?.id != undefined
            ? (
              <AlertConvertDialog
                invoiceId={ formData.id }
                createInitialPaymentVoucher={ createInitialPaymentVoucher }
                onSuccess={ (data) =>
                {
                  dispatch(slice.formActions.updateFormData(data));
                  onSuccess?.(data, mode);
                } }
              />
            )
            : undefined
        } }
        tabs={ [
          {
            label: t("invoices.basicInfo"),
            icon: Box,
            active: true,
            content: <InvoiceBasicTab />
          },
          ...(formData.type !== InvoiceType.Quotation
            ? [{
              label: t("invoices.paymentVouchers"),
              icon: BanknoteArrowDown,
              active: false,
              content: <InvoicePaymentsTab />
            }]
            : []),
          ...(formData.type !== InvoiceType.Quotation
            ? [{
              label: t("invoices.invoiceCosts"),
              icon: BanknoteArrowUp,
              active: false,
              content: <InvoiceCostsTab />
            }]
            : []),
          {
            label: t("invoices.invoicePolicy"),
            icon: Siren,
            active: false,
            content: <InvoicePolicyTab />
          },
          {
            label: t("invoices.invoiceAttachments"),
            icon: FolderKanban,
            active: false,
            content: <InvoiceFilesTab />
          }
        ] }
      />
    </InvoiceContext.Provider>
  );
}
