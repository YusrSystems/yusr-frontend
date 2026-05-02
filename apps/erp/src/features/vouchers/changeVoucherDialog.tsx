import ClientsAndSuppliersSearchableSelect from "@/core/components/searchableSelect/clientsAndSuppliersSearchableSelect";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import { useEffect, useMemo, useState } from "react";
import { NumbertoWordsService } from "yusr-core";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, DateField, FieldGroup, FieldsSection, FormField, NumberField, SelectField, TextAreaField, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import PaymentMethod, { CommissionType, PaymentMethodSlice } from "../../core/data/paymentMethod";
import Voucher, { VoucherSlice, VoucherType, VoucherValidationRules } from "../../core/data/voucher";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeVoucherDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Voucher>)
{
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.clientsAndSuppliers);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const authState = useAppSelector((state) => state.auth);
  const [amountToWords, setAmountToWords] = useState("");

  const initialValues = useMemo(() => ({
    type: entity?.type || VoucherType.Receipt,
    ...entity,
    date: entity?.date ? new Date(entity.date) : new Date(),
    amount: entity?.amount || 0,
    commissionAmount: entity?.commissionAmount || 0
  }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.voucherForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    VoucherValidationRules.validationRules,
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

  const calculateCommission = (amount: number | undefined, methodId?: number): number =>
  {
    if (!methodId || !amount)
    {
      return 0;
    }
    const method = paymentMethodState.entities.data?.find((m) => m.id === methodId);
    if (!method)
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

  const handleTypeChange = (val: string) =>
  {
    const newType = Number(val) as VoucherType;
    dispatch(VoucherSlice.formActions.updateFormData({
      type: newType,
      amountDue: newType === VoucherType.Payment ? formData.amountDue : undefined,
      commissionAmount: newType === VoucherType.Receipt
        ? calculateCommission(formData.amount, formData.paymentMethodId)
        : 0
    }));
  };

  const handleAmountChange = (val: number | undefined) =>
  {
    dispatch(VoucherSlice.formActions.updateFormData({
      amount: val,
      commissionAmount: formData.type === VoucherType.Receipt ? calculateCommission(val, formData.paymentMethodId) : 0
    }));
  };

  const handlePaymentMethodChange = (paymentMethod: PaymentMethod) =>
  {
    dispatch(VoucherSlice.formActions.updateFormData({
      paymentMethodId: paymentMethod.id,
      paymentMethod: paymentMethod,
      commissionAmount: formData.type === VoucherType.Receipt
        ? calculateCommission(formData.amount, paymentMethod.id)
        : 0
    }));
  };

  const isPayment = formData.type === VoucherType.Payment;
  const isReceipt = formData.type === VoucherType.Receipt;

  return (
    <ChangeDialog<Voucher>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} سند` }
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
          <FieldsSection title="المعلومات الأساسية" columns={ 3 }>
            <SelectField
              label="نوع السند"
              required
              value={ formData.type?.toString() || "" }
              onValueChange={ handleTypeChange }
              isInvalid={ isInvalid("type") }
              error={ getError("type") }
              options={ [{ label: "سند قبض", value: VoucherType.Receipt.toString() }, {
                label: "سند صرف",
                value: VoucherType.Payment.toString()
              }] }
            />

            <DateField
              label="التاريخ"
              required
              value={ formData.date ? new Date(formData.date) : undefined }
              onChange={ (date) => dispatch(VoucherSlice.formActions.updateFormData({ date: date })) }
              isInvalid={ isInvalid("date") }
              error={ getError("date") }
            />

            <NumberField
              label="المبلغ"
              required
              value={ formData.amount || 0 }
              onChange={ handleAmountChange }
              isInvalid={ isInvalid("amount") }
              error={ getError("amount") }
            />

            <div className="col-span-full">
              <TextField
                label={ "التفقيط" }
                value={ amountToWords }
                onChange={ () => undefined }
              />
            </div>
          </FieldsSection>

          <FieldsSection title="الحساب وطريقة الدفع" columns={ 2 }>
            <FormField
              label="الحساب"
              required
              isInvalid={ isInvalid("accountId") }
              error={ getError("accountId") }
            >
              <ClientsAndSuppliersSearchableSelect
                id={ formData.accountId }
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
              label="طريقة الدفع"
              required
              isInvalid={ isInvalid("paymentMethodId") }
              error={ getError("paymentMethodId") }
            >
              <PaymentMethodsSearchableSelect
                id={ formData.paymentMethodId }
                isInvalid={ isInvalid("paymentMethodId") }
                onValueChange={ handlePaymentMethodChange }
              />
            </FormField>
          </FieldsSection>

          <FieldsSection title="تفاصيل مالية" columns={ 2 }>
            { isPayment && (
              <NumberField
                label="المبلغ المستحق"
                value={ formData.amountDue || 0 }
                onChange={ (val) => dispatch(VoucherSlice.formActions.updateFormData({ amountDue: val })) }
              />
            ) }

            { isReceipt && (
              <NumberField
                label="مبلغ العمولة (محسوب تلقائياً)"
                value={ formData.commissionAmount || 0 }
                disabled={ true }
                className="bg-muted"
              />
            ) }
          </FieldsSection>

          <FieldsSection title="معلومات الأطراف" columns={ 2 }>
            <TextField
              label={ "المعطي" }
              value={ formData.giver || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ giver: e.target.value })) }
            />
            <TextField
              label={ "المستلم" }
              value={ formData.recipient || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ recipient: e.target.value })) }
            />
            <TextField
              label="سبب الدفع / القبض"
              value={ formData.paymentReason || "" }
              onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ paymentReason: e.target.value })) }
            />
          </FieldsSection>

          { formData.invoiceId && (
            <FieldsSection title="ارتباطات النظام" columns={ 1 }>
              <TextField
                label="رقم الفاتورة المرتبطة"
                value={ `#${formData.invoiceId}` }
                disabled={ true }
                className="bg-muted w-1/2"
              />
            </FieldsSection>
          ) }

          <FieldsSection title="البيان والملاحظات" columns={ 1 }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextAreaField
                label="البيان"
                value={ formData.description || "" }
                onChange={ (e) => dispatch(VoucherSlice.formActions.updateFormData({ description: e.target.value })) }
                rows={ 3 }
              />
              <TextAreaField
                label="ملاحظات إضافية"
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
