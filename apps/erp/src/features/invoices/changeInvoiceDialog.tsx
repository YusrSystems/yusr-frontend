import { BanknoteArrowUp, Box, CheckCircle2, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps, DialogMode, IEntityState } from "yusr-ui";
import { Button, ChangeDialogTabbed, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FilterByTypeRequest, Loading, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import Account, { type AccountSliceType } from "../../core/data/account";
import type Invoice from "../../core/data/invoice";
import { InvoiceRelationType, InvoiceSlice, InvoiceStatus, InvoiceType, InvoiceValidationRules } from "../../core/data/invoice";
import { ItemType } from "../../core/data/item";
import { PaymentMethodSlice } from "../../core/data/paymentMethod";
import { StoreSlice } from "../../core/data/store";
import InvoicesApiService from "../../core/networking/invoiceApiService";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import { InvoiceContext } from "./logic/invoiceContext";
import InvoiceItemsMath from "./logic/invoiceItemsMath";
import { useInvoiceLogic } from "./logic/useInvoiceLogic";
import InvoiceBasicTab from "./presentation/basic/invoiceBasicTab";
import InvoiceCostsTab from "./presentation/costs/invoiceCostsTab";
import AlertConvertDialog from "./presentation/dialogs/alertConvertDialog";
import InvoiceFilesTab from "./presentation/files/invoiceFilesTab";
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
  const { createInitialPaymentVoucher } = useInvoiceLogic(authState);
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
        ? new Date(entity.date).toLocaleDateString("en-CA")
        : new Date().toLocaleDateString("en-CA"),
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
    if (mode === "update")
    {
      return;
    }

    const taxInclusivePrice = invoiceTaxInclusivePrice();

    if (formData.type === InvoiceType.Quotation)
    {
      dispatch(slice.formActions.resetPaymentVouchers({}));
      dispatch(
        slice.formActions.updateFormData({
          fullAmount: taxInclusivePrice
        })
      );
      return;
    }

    if (paymentVouchers().length === 0)
    {
      dispatch(slice.formActions.resetPaymentVouchers({}));
      dispatch(
        slice.formActions.addVoucher(createInitialPaymentVoucher(formData as Invoice, taxInclusivePrice))
      );
    }
    else if (paymentVouchers().length === 1)
    {
      const voucher = paymentVouchers()[0];
      const isVoucherAccountIdValid = voucher.accountId != undefined && voucher.accountId !== 0;
      const updatedVoucher = {
        ...voucher,
        amount: taxInclusivePrice,
        amountReceived: taxInclusivePrice,
        accountId: isVoucherAccountIdValid ? voucher.accountId : formData.actionAccountId,
        accountName: isVoucherAccountIdValid ? voucher.accountName : formData.actionAccountName
      };
      dispatch(slice.formActions.updateVoucher(updatedVoucher));
    }

    dispatch(
      slice.formActions.updateFormData({
        fullAmount: taxInclusivePrice,
        paidAmount: taxInclusivePrice
      })
    );
  }, [formData.invoiceItems, formData.actionAccountId, formData.type, accountState.entities.data?.length]);

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
                createInitialPaymentVoucher={ () =>
                  createInitialPaymentVoucher(formData as Invoice, invoiceTaxInclusivePrice()) }
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
