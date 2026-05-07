import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import type Unit from "../../core/data/unit";
import { UnitSlice, UnitValidationRules } from "../../core/data/unit";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeUnitDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Unit>)
{
  const { t } = useTranslation(["stocking", "common"]);
  const dispatch = useAppDispatch();
  const initialValues = useMemo(() => ({ ...entity, name: entity?.name || "" }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.unitForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    UnitValidationRules.validationRules(t),
    (errors) => dispatch(UnitSlice.formActions.setErrors(errors))
  );
  useFormInit(UnitSlice.formActions.setInitialData, initialValues);

  const title = mode === "create" ? t("units.addNewTitle") : `${t("common:crudRow.edit")} ${t("units.entityName")}`;

  return (
    <ChangeDialog<Unit>
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
          label={ t("units.unitName") }
          required
          value={ formData.name || "" }
          onChange={ (e) => dispatch(UnitSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
