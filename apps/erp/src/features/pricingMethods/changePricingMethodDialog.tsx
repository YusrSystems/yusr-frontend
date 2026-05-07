import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import type PricingMethod from "../../core/data/pricingMethod";
import { PricingMethodSlice, PricingMethodValidationRules } from "../../core/data/pricingMethod";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangePricingMethodDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<PricingMethod>)
{
  const { t } = useTranslation(["accounting", "common"]);
  const initialValues = useMemo(
    () => ({
      ...entity,
      pricingMethodName: entity?.name || ""
    }),
    [entity]
  );

  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.pricingMethodForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    PricingMethodValidationRules.validationRules(t),
    (errors) => dispatch(PricingMethodSlice.formActions.setErrors(errors))
  );
  useFormInit(PricingMethodSlice.formActions.setInitialData, initialValues);

  const title = mode === "create"
    ? t("pricingMethods.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("pricingMethods.entityName")}`;

  return (
    <ChangeDialog<PricingMethod>
      title={ title }
      className="sm:max-w-md"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => false }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <TextField
          label={ t("pricingMethods.methodName") }
          required
          value={ formData.name || "" }
          onChange={ (e) => dispatch(PricingMethodSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
