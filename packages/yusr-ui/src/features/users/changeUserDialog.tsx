import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BranchesSearchableSelect, ChangeDialogOld, type CommonChangeDialogPropsOld, FormFieldOld, PasswordFieldOld, RolesSearchableSelect, SelectFieldOld, TextFieldOld } from "../../components/custom";
import { FieldGroup } from "../../components/pure";
import { BranchSlice, RoleSlice, UserOld, UserSlice, UserValidationRules } from "../../entities";
import { useFormErrors, useFormInit, useValidate } from "../../hooks";
import { useAppDispatch } from "../../state";

export function ChangeUserDialog({ entity, mode, service, onSuccess }: CommonChangeDialogPropsOld<UserOld>)
{
  const { t } = useTranslation(["commonEntities", "common"]);
  const roleState = useSelector((state: any) => state.role);
  const branchState = useSelector((state: any) => state.branch);
  const dispatch = useAppDispatch();

  const initialValues = useMemo(() => ({ ...entity, password: "" }), [entity]);

  const { formData, errors } = useSelector((state: any) => state.userForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    UserValidationRules.validationRules(t),
    (errors) => dispatch(UserSlice.formActions.setErrors(errors))
  );
  useFormInit(UserSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(RoleSlice.entityActions.filter());
    dispatch(BranchSlice.entityActions.filter());
  }, [dispatch]);

  const title = mode === "create" ? t("users.addNewTitle") : `${t("common:crudRow.edit")} ${t("users.entityName")}`;

  return (
    <ChangeDialogOld<UserOld>
      title={ title }
      className="sm:max-w-xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => roleState.isLoading || branchState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextFieldOld
            label={ t("users.username") }
            required
            value={ formData.username || "" }
            onChange={ (e) => dispatch(UserSlice.formActions.updateFormData({ username: e.target.value })) }
            isInvalid={ isInvalid("username") }
            error={ getError("username") }
          />

          <PasswordFieldOld
            label={ t("users.password") }
            required
            value={ formData.password || "" }
            onChange={ (e) => dispatch(UserSlice.formActions.updateFormData({ password: e.target.value })) }
            isInvalid={ isInvalid("password") }
            error={ getError("password") }
          />
        </div>

        <FormFieldOld label={ t("users.role") } required isInvalid={ isInvalid("roleId") } error={ getError("roleId") }>
          <RolesSearchableSelect
            selectedId={ formData.roleId }
            selectedLabel={ "must be set" }
            isInvalid={ isInvalid("roleId") }
            onValueChange={ (role) =>
            {
              dispatch(UserSlice.formActions.updateFormData({ roleId: role?.id }));
              dispatch(UserSlice.formActions.updateFormData({ role: role }));
            } }
          />
        </FormFieldOld>

        <FormFieldOld
          label={ t("users.branch") }
          required
          isInvalid={ isInvalid("branchId") }
          error={ getError("branchId") }
        >
          <BranchesSearchableSelect
            selectedId={ formData.branchId }
            selectedLabel={ formData.branch?.name }
            isInvalid={ isInvalid("branchId") }
            onValueChange={ (branch) =>
            {
              dispatch(UserSlice.formActions.updateFormData({ branchId: branch?.id }));
              dispatch(UserSlice.formActions.updateFormData({ branch: branch }));
            } }
          />
        </FormFieldOld>

        <SelectFieldOld
          label={ t("users.userStatus") }
          value={ formData.isActive ? "active" : "inactive" }
          onValueChange={ (val) => dispatch(UserSlice.formActions.updateFormData({ isActive: val === "active" })) }
          required={ true }
          options={ [{ label: t("users.active"), value: "active" }, { label: t("users.inactive"), value: "inactive" }] }
        />
      </FieldGroup>
    </ChangeDialogOld>
  );
}
