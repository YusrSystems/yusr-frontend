import ClientsAndSuppliersSearchableSelect from "@/core/components/searchableSelect/clientsAndSuppliersSearchableSelect";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogPropsOld } from "yusr-ui";
import { ChangeDialogOld, CheckboxField, CurrencyIcon, DateField, FieldGroup, FieldsSection, FormFieldOld, NumberFieldOld, NumbertoWordsService, SelectFieldOld, TextAreaField, TextFieldOld, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import PaymentMethod, { CommissionType, PaymentMethodSlice } from "../../core/data/paymentMethod";
import Voucher, { VoucherSlice, VoucherType, VoucherValidationRules } from "../../core/data/voucher";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeVoucherDialog({ entity, mode, service, onSuccess }: CommonChangeDialogPropsOld<Voucher>)
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
    isAmountDue: entity?.isAmountDue,
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
      isAmountDue: newType === VoucherType.Payment ? formData.isAmountDue : false,
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
    <ChangeDialogOld<Voucher>
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
          <FieldsSection title={ t("vouchers.basicInfo") } columns={ 2 }>
            <SelectFieldOld
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
          </FieldsSection>

          <FieldsSection columns={ 2 }>
            <FormFieldOld
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
            </FormFieldOld>

            <FormFieldOld
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
            </FormFieldOld>
          </FieldsSection>

          <FieldsSection columns={ 3 }>
            <NumberFieldOld
              label={ t("vouchers.amount") }
              required
              value={ formData.amount || 0 }
              onChange={ handleAmountChange }
              isInvalid={ isInvalid("amount") }
              error={ getError("amount") }
              currency={ <CurrencyIcon /> }
            />

            { isReceipt && (
              <NumberFieldOld
                label={ t("vouchers.commissionAmount") }
                value={ formData.commissionAmount || 0 }
                disabled={ true }
                className="bg-muted"
              />
            ) }

            { isPayment && (
              <CheckboxField
                required
                id="isAmountDue"
                label={ t("vouchers.amountDue") }
                error={ getError("isAmountDue") }
                isInvalid={ isInvalid("isAmountDue") }
                checked={ formData.isAmountDue ?? false }
                onCheckedChange={ (val) => dispatch(VoucherSlice.formActions.updateFormData({ isAmountDue: val })) }
              />
            ) }

            <TextFieldOld
              disabled
              label={ t("vouchers.amountInWords") }
              value={ amountToWords }
              onChange={ () => undefined }
            />
          </FieldsSection>

          <FieldsSection title={ t("vouchers.partyInfo") } columns={ 2 }>
            <TextFieldOld
              label={ t("vouchers.giver") }
              value={ formData.giver || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ giver: e.target.value })) }
            />
            <TextFieldOld
              label={ t("vouchers.recipient") }
              value={ formData.recipient || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ recipient: e.target.value })) }
            />
          </FieldsSection>

          { formData.invoiceId && (
            <FieldsSection title={ t("vouchers.systemLinks") } columns={ 1 }>
              <TextFieldOld
                label={ t("vouchers.relatedInvoice") }
                value={ `#${formData.invoiceId}` }
                disabled={ true }
                className="bg-muted w-1/2"
              />
            </FieldsSection>
          ) }

          <FieldsSection columns={ 1 }>
            <TextAreaField
              label={ t("vouchers.description") }
              value={ formData.description || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ description: e.target.value })) }
              rows={ 15 }
            />
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialogOld>
  );
}
