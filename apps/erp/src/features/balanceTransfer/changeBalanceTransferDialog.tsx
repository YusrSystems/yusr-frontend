import BanksAndBoxesSearchableSelect from "@/core/components/searchableSelect/banksAndBoxesSearchableSelect";
import { useEffect, useMemo, useState } from "react";
import { NumbertoWordsService } from "yusr-core";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, DateField, FieldGroup, FieldsSection, FormField, NumberField, TextAreaField, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { BanksAndBoxesSlice } from "../../core/data/account";
import type BalanceTransfer from "../../core/data/balanceTransfer";
import { BalanceTransferSlice, BalanceTransferValidationRules } from "../../core/data/balanceTransfer";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeBalanceTransferDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<BalanceTransfer>
)
{
  const [amountToWords, setAmountToWords] = useState("");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const accountState = useAppSelector((state) => state.banksAndBoxes);

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date || new Date(),
    amount: entity?.amount || 0
  }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.balanceTransferForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    BalanceTransferValidationRules.validationRules,
    (errors) => dispatch(BalanceTransferSlice.formActions.setErrors(errors))
  );
  useFormInit(BalanceTransferSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(BanksAndBoxesSlice.entityActions.filter(undefined));
  }, [dispatch]);

  useEffect(() =>
  {
    if (formData.amount !== undefined && authState.setting?.currency)
    {
      setAmountToWords(NumbertoWordsService.ConvertAmount(formData.amount, authState.setting.currency));
    }
  }, [formData.amount, authState.setting?.currency]);

  const availableFromAccounts = useMemo(() =>
  {
    return accountState.entities.data?.filter((a) => a.id !== formData.toAccountId) ?? [];
  }, [accountState.entities.data, formData.toAccountId]);

  const availableToAccounts = useMemo(() =>
  {
    return accountState.entities.data?.filter((a) => a.id !== formData.fromAccountId) ?? [];
  }, [accountState.entities.data, formData.fromAccountId]);

  return (
    <ChangeDialog<BalanceTransfer>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} تحويل رصيد` }
      className="sm:max-w-2xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => accountState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup>
          <FieldsSection title="تفاصيل التحويل" columns={ 2 }>
            <DateField
              label="تاريخ التحويل"
              required
              value={ formData.date ? new Date(formData.date) : undefined }
              onChange={ (date) => dispatch(BalanceTransferSlice.formActions.updateFormData({ date: date })) }
              isInvalid={ isInvalid("date") }
              error={ getError("date") }
            />

            <NumberField
              label="المبلغ"
              required
              value={ formData.amount || 0 }
              onChange={ (val) => dispatch(BalanceTransferSlice.formActions.updateFormData({ amount: val })) }
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

          <FieldsSection title="أطراف التحويل" columns={ 2 }>
            <FormField
              label="من حساب"
              required
              isInvalid={ isInvalid("fromAccountId") }
              error={ getError("fromAccountId") }
            >
              <BanksAndBoxesSearchableSelect
                id={ formData.fromAccountId }
                items={ availableFromAccounts }
                isInvalid={ isInvalid("fromAccountId") }
                onValueChange={ (account) =>
                {
                  dispatch(
                    BalanceTransferSlice.formActions.updateFormData({
                      fromAccountId: account?.id,
                      fromAccountName: account?.name
                    })
                  );
                } }
              />
            </FormField>

            <FormField
              label="إلى حساب"
              required
              isInvalid={ isInvalid("toAccountId") }
              error={ getError("toAccountId") }
            >
              <BanksAndBoxesSearchableSelect
                id={ formData.toAccountId }
                items={ availableToAccounts }
                isInvalid={ isInvalid("toAccountId") }
                onValueChange={ (account) =>
                {
                  dispatch(
                    BalanceTransferSlice.formActions.updateFormData({
                      toAccountId: account?.id,
                      toAccountName: account?.name
                    })
                  );
                } }
              />
            </FormField>
          </FieldsSection>

          <FieldsSection title="معلومات إضافية" columns={ 1 }>
            <TextAreaField
              label="البيان / الوصف"
              value={ formData.description || "" }
              onChange={ (e) =>
                dispatch(BalanceTransferSlice.formActions.updateFormData({ description: e.target.value })) }
              rows={ 3 }
              placeholder="اكتب سبب التحويل أو أي ملاحظات أخرى..."
            />
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
