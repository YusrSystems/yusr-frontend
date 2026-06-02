import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, TextFieldOld, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import type Store from "../../core/data/store";
import { StoreSlice, StoreValidationRules } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeStoreDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Store>)
{
  const { t } = useTranslation(["stocking", "common"]);
  const dispatch = useAppDispatch();
  const initialValues = useMemo(
    () => ({
      ...entity,
      storeName: entity?.name || ""
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector((state) => state.storeForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    StoreValidationRules.validationRules(t),
    (errors) => dispatch(StoreSlice.formActions.setErrors(errors))
  );
  useFormInit(StoreSlice.formActions.setInitialData, initialValues);

  const title = mode === "create" ? t("stores.addNewTitle") : `${t("common:crudRow.edit")} ${t("stores.entityName")}`;

  return (
    <ChangeDialog<Store>
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
        <TextFieldOld
          label={ t("stores.storeName") }
          required
          value={ formData.name || "" }
          onChange={ (e) => dispatch(StoreSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
