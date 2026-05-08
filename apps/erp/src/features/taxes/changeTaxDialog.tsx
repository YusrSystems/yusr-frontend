import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, NumberField, SelectField, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { type Tax, TaxSlice, TaxValidationRules } from "../../core/data/tax";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeTaxDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Tax>)
{
  const { t } = useTranslation(["accounting", "common"]);
  const dispatch = useAppDispatch();
  const initialValues = useMemo(() => ({ isPrimary: false, ...entity }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.taxForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    TaxValidationRules.validationRules(t),
    (errors) => dispatch(TaxSlice.formActions.setErrors(errors))
  );
  useFormInit(TaxSlice.formActions.setInitialData, initialValues);

  const title = mode === "create" ? t("taxes.addNewTitle") : `${t("common:crudRow.edit")} ${t("taxes.entityName")}`;

  return (
    <ChangeDialog<Tax>
      title={ title }
      className="sm:max-w-lg"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label={ t("taxes.taxName") }
            required
            value={ formData.name || "" }
            onChange={ (e) => dispatch(TaxSlice.formActions.updateFormData({ name: e.target.value })) }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
          />

          <NumberField
            label={ t("taxes.percentage") }
            required
            min={ 0 }
            max={ 100 }
            value={ formData.percentage ?? 0 }
            onChange={ (value) => dispatch(TaxSlice.formActions.updateFormData({ percentage: Number(value) })) }
            isInvalid={ isInvalid("percentage") }
            error={ getError("percentage") }
          />
        </div>

        <SelectField
          label={ t("taxes.isPrimary") }
          value={ formData.isPrimary ? "yes" : "no" }
          onValueChange={ (val) => dispatch(TaxSlice.formActions.updateFormData({ isPrimary: val === "yes" })) }
          required={ true }
          options={ [{ label: t("common:yes"), value: "yes" }, { label: t("common:no"), value: "no" }] }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
