import BranchesSearchableSelect from "@/core/components/searchableSelect/branchesSearchableSelect";
import RolesSearchableSelect from "@/core/components/searchableSelect/rolesSearchableSelect";
import { useEffect, useMemo } from "react";
import { User } from "yusr-core";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, FormField, PasswordField, SelectField, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { BranchSlice } from "../../core/data/branchLogic";
import { RoleSlice } from "../../core/data/role";
import { UserSlice, UserValidationRules } from "../../core/data/UserLogic";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeUserDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<User>)
{
  const roleState = useAppSelector((state) => state.role);
  const branchState = useAppSelector((state) => state.branch);
  const dispatch = useAppDispatch();

  const initialValues = useMemo(() => ({ ...entity, password: "" }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.userForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    UserValidationRules.validationRules,
    (errors) => dispatch(UserSlice.formActions.setErrors(errors))
  );
  useFormInit(UserSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(RoleSlice.entityActions.filter());
    dispatch(BranchSlice.entityActions.filter());
  }, [dispatch]);

  return (
    <ChangeDialog<User>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} مستخدم` }
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
          <TextField
            label="اسم المستخدم"
            required
            value={ formData.username || "" }
            onChange={ (e) => dispatch(UserSlice.formActions.updateFormData({ username: e.target.value })) }
            isInvalid={ isInvalid("username") }
            error={ getError("username") }
          />

          <PasswordField
            label="كلمة المرور"
            required
            value={ formData.password || "" }
            onChange={ (e) => dispatch(UserSlice.formActions.updateFormData({ password: e.target.value })) }
            isInvalid={ isInvalid("password") }
            error={ getError("password") }
          />
        </div>

        <FormField label="الدور" required isInvalid={ isInvalid("roleId") } error={ getError("roleId") }>
          <RolesSearchableSelect
            id={ formData.roleId }
            isInvalid={ isInvalid("roleId") }
            onValueChange={ (role) =>
            {
              dispatch(UserSlice.formActions.updateFormData({ roleId: role.id }));
              dispatch(UserSlice.formActions.updateFormData({ role: role }));
            } }
          />
        </FormField>

        <FormField label="الفرع" required isInvalid={ isInvalid("branchId") } error={ getError("branchId") }>
          <BranchesSearchableSelect
            id={ formData.branchId }
            isInvalid={ isInvalid("branchId") }
            onValueChange={ (branch) =>
            {
              dispatch(UserSlice.formActions.updateFormData({ branchId: branch.id }));
              dispatch(UserSlice.formActions.updateFormData({ branch: branch }));
            } }
          />
        </FormField>

        <SelectField
          label="حالة المستخدم"
          value={ formData.isActive ? "active" : "inactive" }
          onValueChange={ (val) => dispatch(UserSlice.formActions.updateFormData({ isActive: val === "active" })) }
          required={ true }
          options={ [{ label: "نشط", value: "active" }, { label: "غير نشط", value: "inactive" }] }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
