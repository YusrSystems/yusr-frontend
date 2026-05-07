import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ChangeDialog, type CommonChangeDialogProps, FieldsSection, FormField, SearchableSelect, TextField } from "../../components/custom";
import { FieldGroup } from "../../components/pure";
import { Branch, BranchSlice, BranchValidationRules, CityFilterColumns, CitySlice } from "../../entities";
import { useFormErrors, useFormInit, useValidate } from "../../hooks";
import { useAppDispatch, type YusrRootState } from "../../state";

export function ChangeBranchDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Branch>)
{
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
    BranchValidationRules.validationRules,
    (errors) => dispatch(BranchSlice.formActions.setErrors(errors))
  );
  useFormInit(BranchSlice.formActions.setInitialData, entity ?? {});

  return (
    <ChangeDialog<Branch>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} فرع` }
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup className="py-2">
        <TextField
          label="اسم الفرع"
          value={ formData.name || "" }
          onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
          required={ true }
        />

        <FormField label="المدينة" required={ true } isInvalid={ isInvalid("cityId") } error={ getError("cityId") }>
          <SearchableSelect
            items={ cityState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر المدينة"
            value={ formData.cityId?.toString() || "" }
            onValueChange={ (val) => dispatch(BranchSlice.formActions.updateFormData({ cityId: Number(val) })) }
            columnsNames={ CityFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(CitySlice.entityActions.filter(condition)) }
            isLoading={ cityState.isLoading }
            isInvalid={ isInvalid("cityId") }
            disabled={ cityState.isLoading }
          />
        </FormField>

        <FieldsSection title="" columns={ 2 }>
          <TextField
            label="الشارع"
            value={ formData.street || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ street: e.target.value })) }
          />
          <TextField
            label="الحي"
            value={ formData.district || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ district: e.target.value })) }
          />
          <TextField
            label="رقم المبنى"
            value={ formData.buildingNumber || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ buildingNumber: e.target.value })) }
            isInvalid={ isInvalid("buildingNumber") }
            error={ getError("buildingNumber") }
          />
          <TextField
            label="الرمز البريدي"
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
