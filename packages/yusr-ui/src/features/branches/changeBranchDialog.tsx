import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ChangeDialog, CitiesSearchableSelect, type CommonChangeDialogProps, FieldsSection, FormField, TextFieldOld } from "../../components/custom";
import { FieldGroup } from "../../components/pure";
import { Branch, BranchSlice, BranchValidationRules, CitySlice } from "../../entities";
import { useFormErrors, useFormInit, useValidate } from "../../hooks";
import { useAppDispatch, type YusrRootState } from "../../state";

export function ChangeBranchDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Branch>)
{
  const { t } = useTranslation(["commonEntities", "common"]);
  const cityState = useSelector((state: YusrRootState) => state.city);
  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    dispatch(CitySlice.entityActions.filter());
  }, [dispatch]);

  const { formData, errors } = useSelector((state: YusrRootState) => state.branchForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    BranchValidationRules.validationRules(t),
    (errors) => dispatch(BranchSlice.formActions.setErrors(errors))
  );
  useFormInit(BranchSlice.formActions.setInitialData, entity ?? {});

  const title = mode === "create"
    ? t("branches.addNewTitle")
    : `${t("common:crudRow.edit")} ${t("branches.entityName")}`;

  return (
    <ChangeDialog<Branch>
      title={ title }
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup className="py-2">
        <TextFieldOld
          label={ t("branches.branchName") }
          value={ formData.name || "" }
          onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
          required={ true }
        />

        <FormField
          label={ t("branches.city") }
          required={ true }
          isInvalid={ isInvalid("cityId") }
          error={ getError("cityId") }
        >
          <CitiesSearchableSelect
            selectedId={ formData.cityId }
            selectedLabel={ formData.city?.name }
            onValueChange={ (city) =>
              dispatch(BranchSlice.formActions.updateFormData({ cityId: city?.id, city: city })) }
            isInvalid={ isInvalid("cityId") }
          />
        </FormField>

        <FieldsSection title="" columns={ 2 }>
          <TextFieldOld
            label={ t("branches.street") }
            value={ formData.street || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ street: e.target.value })) }
          />
          <TextFieldOld
            label={ t("branches.district") }
            value={ formData.district || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ district: e.target.value })) }
          />
          <TextFieldOld
            label={ t("branches.buildingNumber") }
            value={ formData.buildingNumber || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ buildingNumber: e.target.value })) }
            isInvalid={ isInvalid("buildingNumber") }
            error={ getError("buildingNumber") }
          />
          <TextFieldOld
            label={ t("branches.postalCode") }
            value={ formData.postalCode || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ postalCode: e.target.value })) }
            isInvalid={ isInvalid("postalCode") }
            error={ getError("postalCode") }
          />
        </FieldsSection>
      </FieldGroup>
    </ChangeDialog>
  );
}
