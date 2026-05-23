import ClientsAndSuppliersSearchableSelect from "@/core/components/searchableSelect/clientsAndSuppliersSearchableSelect";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, CurrencyIcon, DateField, FieldGroup, FieldsSection, FormField, NumberField, NumbertoWordsService, SelectField, TextAreaField, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import PaymentMethod, { CommissionType, PaymentMethodSlice } from "../../core/data/paymentMethod";
import Voucher, { VoucherSlice, VoucherType, VoucherValidationRules } from "../../core/data/voucher";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeVoucherDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Voucher>)
{
  const { t } = useTranslation(["accounting", "common"]);
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.clientsAndSuppliers);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const authState = useAppSelector((state) => state.auth);
  const [amountToWords, setAmountToWords] = useState("");

  const initialValues = useMemo(() => ({
    type: entity?.type || VoucherType.Receipt,
    ...entity,
    date: entity?.date ? new Date(entity.date).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA"),
    amount: entity?.amount || 0,
    commissionAmount: entity?.commissionAmount || 0
  }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.voucherForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    VoucherValidationRules.validationRules(t),
    (errors) => dispatch(VoucherSlice.formActions.setErrors(errors))
  );
  useFormInit(VoucherSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(ClientsAndSuppliersSlice.entityActions.filter());
    dispatch(PaymentMethodSlice.entityActions.filter());
  }, [dispatch]);

  useEffect(() =>
  {
    if (formData.amount !== undefined && authState.setting?.currency)
    {
      setAmountToWords(NumbertoWordsService.ConvertAmount(formData.amount, authState.setting.currency));
    }
  }, [formData.amount, authState.setting?.currency]);

  const calculateCommission = (type?: VoucherType, amount?: number, method?: PaymentMethod): number =>
  {
    if (type == undefined || amount == undefined || method == undefined || type === VoucherType.Payment)
    {
      return 0;
    }

    if (method.commissionType === CommissionType.Percent)
    {
      return (amount * (method.commissionAmount || 0)) / 100;
    }
    else if (method.commissionType === CommissionType.Amount)
    {
      return method.commissionAmount || 0;
    }

    return 0;
  };

  const getPaymentMethod = (paymentMethodId?: number): PaymentMethod | undefined =>
  {
    return paymentMethodState.entities.data?.find((pm) => pm.id === paymentMethodId);
  };

  const handleTypeChange = (val: string) =>
  {
    const newType = Number(val) as VoucherType;
    dispatch(VoucherSlice.formActions.updateFormData({
      type: newType,
      amountDue: newType === VoucherType.Payment ? formData.amountDue : undefined,
      commissionAmount: calculateCommission(newType, formData.amount, getPaymentMethod(formData.paymentMethodId))
    }));
  };

  const handleAmountChange = (val: number | undefined) =>
  {
    dispatch(VoucherSlice.formActions.updateFormData({
      amount: val,
      commissionAmount: calculateCommission(formData.type, val, getPaymentMethod(formData.paymentMethodId))
    }));
  };

  const handlePaymentMethodChange = (paymentMethod?: PaymentMethod) =>
  {
    dispatch(VoucherSlice.formActions.updateFormData({
      paymentMethodId: paymentMethod?.id,
      paymentMethod: paymentMethod,
      commissionAmount: calculateCommission(formData.type, formData.amount, paymentMethod)
    }));
  };

  const isPayment = formData.type === VoucherType.Payment;
  const isReceipt = formData.type === VoucherType.Receipt;

  return (
    <ChangeDialog<Voucher>
      title={ mode === "create"
        ? t("vouchers.addNewTitle")
        : `${t("common:crudRow.edit")} ${t("vouchers.entityName")}` }
      className="sm:max-w-4xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => accountState.isLoading || paymentMethodState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup className="gap-10">
          <FieldsSection title={ t("vouchers.basicInfo") } columns={ 3 }>
            <SelectField
              label={ t("vouchers.voucherType") }
              required
              value={ formData.type?.toString() || "" }
              onValueChange={ handleTypeChange }
              isInvalid={ isInvalid("type") }
              error={ getError("type") }
              options={ [{ label: t("vouchers.receiptVoucher"), value: VoucherType.Receipt.toString() }, {
                label: t("vouchers.paymentVoucher"),
                value: VoucherType.Payment.toString()
              }] }
            />

            <DateField
              label={ t("vouchers.date") }
              required
              value={ formData.date ? new Date(formData.date) : undefined }
              onChange={ (date) => dispatch(VoucherSlice.formActions.updateFormData({ date: date })) }
              isInvalid={ isInvalid("date") }
              error={ getError("date") }
            />

            <NumberField
              label={ t("vouchers.amount") }
              required
              value={ formData.amount || 0 }
              onChange={ handleAmountChange }
              isInvalid={ isInvalid("amount") }
              error={ getError("amount") }
              currency={ <CurrencyIcon /> }
            />

            <div className="col-span-full">
              <TextField
                label={ t("vouchers.amountInWords") }
                value={ amountToWords }
                onChange={ () => undefined }
              />
            </div>
          </FieldsSection>

          <FieldsSection title={ t("vouchers.accountAndPayment") } columns={ 2 }>
            <FormField
              label={ t("vouchers.account") }
              required
              isInvalid={ isInvalid("accountId") }
              error={ getError("accountId") }
            >
              <ClientsAndSuppliersSearchableSelect
                selectedId={ formData.accountId }
                selectedLabel={ formData.accountName }
                isInvalid={ isInvalid("accountId") }
                onValueChange={ (account) =>
                {
                  dispatch(
                    VoucherSlice.formActions.updateFormData({ accountId: account?.id, accountName: account?.name })
                  );
                } }
              />
            </FormField>

            <FormField
              label={ t("vouchers.paymentMethod") }
              required
              isInvalid={ isInvalid("paymentMethodId") }
              error={ getError("paymentMethodId") }
            >
              <PaymentMethodsSearchableSelect
                selectedId={ formData.paymentMethodId }
                selectedLabel={ formData.paymentMethod?.name }
                isInvalid={ isInvalid("paymentMethodId") }
                onValueChange={ handlePaymentMethodChange }
              />
            </FormField>
          </FieldsSection>

          <FieldsSection title={ t("vouchers.financialDetails") } columns={ 2 }>
            { isPayment && (
              <NumberField
                label={ t("vouchers.amountDue") }
                value={ formData.amountDue || 0 }
                onChange={ (val) => dispatch(VoucherSlice.formActions.updateFormData({ amountDue: val })) }
              />
            ) }

            { isReceipt && (
              <NumberField
                label={ t("vouchers.commissionAmount") }
                value={ formData.commissionAmount || 0 }
                disabled={ true }
                className="bg-muted"
              />
            ) }
          </FieldsSection>

          <FieldsSection title={ t("vouchers.partyInfo") } columns={ 2 }>
            <TextField
              label={ t("vouchers.giver") }
              value={ formData.giver || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ giver: e.target.value })) }
            />
            <TextField
              label={ t("vouchers.recipient") }
              value={ formData.recipient || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ recipient: e.target.value })) }
            />
            <TextField
              label={ t("vouchers.paymentReason") }
              value={ formData.paymentReason || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ paymentReason: e.target.value })) }
            />
          </FieldsSection>

          { formData.invoiceId && (
            <FieldsSection title={ t("vouchers.systemLinks") } columns={ 1 }>
              <TextField
                label={ t("vouchers.relatedInvoice") }
                value={ `#${formData.invoiceId}` }
                disabled={ true }
                className="bg-muted w-1/2"
              />
            </FieldsSection>
          ) }

          <FieldsSection title={ t("vouchers.descriptionAndNotes") } columns={ 1 }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextAreaField
                label={ t("vouchers.description") }
                value={ formData.description || "" }
                onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ description: e.target.value })) }
                rows={ 3 }
              />
              <TextAreaField
                label={ t("vouchers.additionalNotes") }
                value={ formData.notes || "" }
                onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ notes: e.target.value })) }
                rows={ 3 }
              />
            </div>
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
