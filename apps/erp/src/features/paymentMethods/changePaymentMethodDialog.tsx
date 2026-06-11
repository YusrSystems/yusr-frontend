import BanksAndBoxesSearchableSelect from "@/core/components/searchableSelect/banksAndBoxesSearchableSelect";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogPropsOld } from "yusr-ui";
import { ChangeDialogOld, FieldGroup, FormFieldOld, NumberFieldOld, SelectFieldOld, TextFieldOld, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { BanksAndBoxesSlice } from "../../core/data/account";
import type PaymentMethodOld from "../../core/data/paymentMethod";
import { CommissionTypeOld, PaymentMethodSlice, PaymentMethodValidationRules } from "../../core/data/paymentMethod";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangePaymentMethodDialog({
  entity,
  mode,
  service,
  filterDataOutside,
  onSuccess
}: CommonChangeDialogPropsOld<PaymentMethodOld> & {
  filterDataOutside?: boolean;
})
{
  const { t } = useTranslation(["accounting", "common"]);
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.banksAndBoxes);

  const initialValues = useMemo(
    () => ({
      ...entity,
      name: entity?.name || "",
      accountId: entity?.accountId || undefined,
      accountName: entity?.accountName || "",
      commissionType: entity?.commissionType || CommissionTypeOld.Percent,
      commissionAmount: entity?.commissionAmount || 0
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector((state) => state.paymentMethodForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    PaymentMethodValidationRules.validationRules(t),
    (errors) => dispatch(PaymentMethodSlice.formActions.setErrors(errors))
  );
  useFormInit(PaymentMethodSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    if (filterDataOutside)
    {
      return;
    }
    dispatch(BanksAndBoxesSlice.entityActions.filter());
  }, []);

  function formatCommission(type: CommissionTypeOld, amount: number): string | null
  {
    if (type === CommissionTypeOld.Amount)
    {
      return t("paymentMethods.commissionHintAmount", { amount });
    }

    let numerator = amount;
    let denominator = 100;

    while (numerator % 1 !== 0)
    {
      numerator *= 10;
      denominator *= 10;
    }

    numerator = Math.round(numerator);

    return t("paymentMethods.commissionHintPercent", { n: numerator, d: denominator });
  }

  const title = mode === "create"
    ? t("paymentMethods.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("paymentMethods.entityName")}`;

  return (
    <ChangeDialogOld<PaymentMethodOld>
      title={ title }
      className="sm:max-w-xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => accountState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextFieldOld
            label={ t("paymentMethods.methodName") }
            required
            value={ formData.name || "" }
            onChange={ (e) => dispatch(PaymentMethodSlice.formActions.updateFormData({ name: e.target.value })) }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
          />

          <FormFieldOld
            label={ t("paymentMethods.responsibleAccount") }
            required
            isInvalid={ isInvalid("accountId") }
            error={ getError("accountId") }
          >
            <BanksAndBoxesSearchableSelect
              selectedId={ formData.accountId }
              selectedLabel={ formData.accountName }
              isInvalid={ isInvalid("accountId") }
              disabled={ mode === "update" }
              onValueChange={ (account) =>
              {
                dispatch(PaymentMethodSlice.formActions.updateFormData({
                  accountId: account?.id,
                  accountName: account?.name
                }));
              } }
            />
          </FormFieldOld>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectFieldOld
            label={ t("paymentMethods.commissionType") }
            required
            value={ formData.commissionType?.toString() || CommissionTypeOld.Percent.toString() }
            onValueChange={ (val) =>
              dispatch(
                PaymentMethodSlice.formActions.updateFormData({ commissionType: Number(val) as CommissionTypeOld })
              ) }
            isInvalid={ isInvalid("commissionType") }
            error={ getError("commissionType") }
            options={ [{ label: t("paymentMethods.percentage"), value: CommissionTypeOld.Percent.toString() }, {
              label: t("paymentMethods.fixedAmount"),
              value: CommissionTypeOld.Amount.toString()
            }] }
          />
          <div className="flex flex-col gap-1">
            <NumberFieldOld
              label={ t("paymentMethods.commissionValue") }
              required
              min={ 0.1 }
              max={ 100 }
              value={ formData.commissionAmount || "" }
              onChange={ (e) =>
                dispatch(PaymentMethodSlice.formActions.updateFormData({ commissionAmount: Number(e) })) }
              isInvalid={ isInvalid("commissionAmount") }
              error={ getError("commissionAmount") }
            />
            <p className="text-sm text-red-600 font-bold">
              { formatCommission(
                formData.commissionType ?? CommissionTypeOld.Percent,
                formData.commissionAmount ?? 0
              ) }
            </p>
          </div>
        </div>
      </FieldGroup>
    </ChangeDialogOld>
  );
}
