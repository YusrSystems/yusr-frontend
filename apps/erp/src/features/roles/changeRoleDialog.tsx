import { useEffect, useMemo } from "react";
import { Role } from "yusr-core";
import type { CommonChangeDialogProps, TabProps } from "yusr-ui";
import { categorizePermissions, ChangeDialogTabbed, PermissionCard, PermissionSkeleton, Skeleton, TextField, useFormErrors, useFormInit, useValidate } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { RoleSlice, RoleValidationRules } from "../../core/data/role";
import { fetchSystemPermissions } from "../../core/state/shared/systemSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { ActionIcons, ArabicLabels, PERMISSION_SECTIONS } from "./permissionConfig";

export default function ChangeRoleDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Role>)
{
  const delimiter: string = ".";
  const { formData, errors } = useAppSelector((state) => state.roleForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    RoleValidationRules.validationRules,
    (errors) => dispatch(RoleSlice.formActions.setErrors(errors))
  );
  useFormInit(RoleSlice.formActions.setInitialData, entity ?? {});
  const systemState = useAppSelector((state) => state.system);
  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    if (systemState.permissions.length === 0)
    {
      dispatch(fetchSystemPermissions());
    }

    if (mode === "create" && systemState.permissions.length > 0)
    {
      dispatch(
        RoleSlice.formActions.setInitialData({
          ...entity,
          permissions: systemState.permissions
        })
      );
    }
  }, [dispatch, systemState.permissions.length]);

  const categorized = useMemo(() =>
  {
    return PERMISSION_SECTIONS.map((section) => ({
      ...section,
      data: categorizePermissions(systemState.permissions, section.resources, delimiter)
    }));
  }, [systemState.permissions]);

  const renderSectionContent = (sectionData: typeof categorized[number]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      { systemState.isLoading
        ? PermissionSkeleton()
        : sectionData.data.map((item) => (
          <PermissionCard
            key={ item.resource }
            resourceId={ item.resource }
            label={ ArabicLabels[item.resource] || item.resource }
            masterPermission={ item.get }
            isMasterRequired={ item.resource === SystemPermissionsResources.Settings }
            selectedPermissions={ formData.permissions || [] }
            onToggle={ (updated) => dispatch(RoleSlice.formActions.updateFormData({ permissions: updated })) }
            actions={ item.actions.map((perm) => ({
              id: perm,
              label: ArabicLabels[perm.split(delimiter)[1]] || perm.split(delimiter)[1],
              icon: ActionIcons[perm.split(delimiter)[1]]
            })) }
          />
        )) }
    </div>
  );

  const tabs: TabProps[] = categorized.map((section, index) => ({
    active: index === 0,
    icon: section.icon,
    label: section.title,
    content: (
      <div className="space-y-4">
        { /* Role name field only in the first tab */ }
        { index === 0 && (
          <TextField
            label="اسم الدور"
            required
            value={ formData.name || "" }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
            onChange={ (e) =>
            {
              dispatch(RoleSlice.formActions.updateFormData({ name: e.target.value }));
              dispatch(RoleSlice.formActions.clearError("name"));
            } }
          />
        ) }
        { systemState.isLoading
          ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              { PermissionSkeleton() }
            </div>
          )
          : renderSectionContent(section) }
      </div>
    ),
    // Mark tab with error if name field has error and we're on the first tab
    hasError: index === 0 ? isInvalid("name") : undefined
  }));

  return (
    <ChangeDialogTabbed<Role>
      changeDialogProps={ {
        title: `${mode === "create" ? "إضافة" : "تعديل"} دور`,
        className: "sm:max-w-6xl",
        formData,
        dialogMode: mode,
        service,
        disable: () => systemState.isLoading,
        onSuccess: (data) => onSuccess?.(data, mode),
        validate
      } }
      tabs={ tabs }
    />
  );
}
