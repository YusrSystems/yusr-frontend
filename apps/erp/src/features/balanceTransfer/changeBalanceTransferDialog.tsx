import BanksAndBoxesSearchableSelect from "@/core/components/searchableSelect/banksAndBoxesSearchableSelect";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, CurrencyIcon, DateField, FieldGroup, FieldsSection, FormField, NumberField, NumbertoWordsService, TextAreaField, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { BanksAndBoxesSlice } from "../../core/data/account";
import type BalanceTransfer from "../../core/data/balanceTransfer";
import { BalanceTransferSlice, BalanceTransferValidationRules } from "../../core/data/balanceTransfer";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeBalanceTransferDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<BalanceTransfer>
)
{
  const { t } = useTranslation(["accounting", "common"]);
  const [amountToWords, setAmountToWords] = useState("");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const accountState = useAppSelector((state) => state.banksAndBoxes);

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date || new Date().toLocaleDateString("en-CA"),
    amount: entity?.amount || 0
  }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.balanceTransferForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    BalanceTransferValidationRules.validationRules(t),
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
      title={ mode === "create"
        ? t("balanceTransfers.addNewTitle")
        : `${t("common:crudRow.edit")} ${t("balanceTransfers.entityName")}` }
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
          <FieldsSection title={ t("balanceTransfers.transferDetails") } columns={ 2 }>
            <DateField
              label={ t("balanceTransfers.transferDate") }
              required
              value={ formData.date ? new Date(formData.date) : undefined }
              onChange={ (date) => dispatch(BalanceTransferSlice.formActions.updateFormData({ date: date })) }
              isInvalid={ isInvalid("date") }
              error={ getError("date") }
            />

            <NumberField
              label={ t("balanceTransfers.amount") }
              required
              value={ formData.amount || 0 }
              onChange={ (val) => dispatch(BalanceTransferSlice.formActions.updateFormData({ amount: val })) }
              isInvalid={ isInvalid("amount") }
              error={ getError("amount") }
              currency={ <CurrencyIcon /> }
            />
            <div className="col-span-full">
              <TextField
                label={ t("balanceTransfers.amountInWords") }
                value={ amountToWords }
                onChange={ () => undefined }
                disabled
              />
            </div>
          </FieldsSection>

          <FieldsSection title={ t("balanceTransfers.transferParties") } columns={ 2 }>
            <FormField
              label={ t("balanceTransfers.fromAccount") }
              required
              isInvalid={ isInvalid("fromAccountId") }
              error={ getError("fromAccountId") }
            >
              <BanksAndBoxesSearchableSelect
                selectedId={ formData.fromAccountId }
                selectedLabel={ formData.fromAccountName }
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
              label={ t("balanceTransfers.toAccount") }
              required
              isInvalid={ isInvalid("toAccountId") }
              error={ getError("toAccountId") }
            >
              <BanksAndBoxesSearchableSelect
                selectedId={ formData.toAccountId }
                selectedLabel={ formData.toAccountName }
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

          <FieldsSection title={ t("balanceTransfers.additionalInfo") } columns={ 1 }>
            <TextAreaField
              label={ t("balanceTransfers.description") }
              value={ formData.description || "" }
              onChange={ (e) =>
                dispatch(BalanceTransferSlice.formActions.updateFormData({ description: e.target.value })) }
              rows={ 3 }
              placeholder={ ". . ." }
            />
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
