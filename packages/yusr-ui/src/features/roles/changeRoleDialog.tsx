import { type LucideIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { categorizePermissions, ChangeDialogTabbed, type CommonChangeDialogPropsOld, PermissionCard, PermissionSkeleton, type TabProps, TextFieldOld } from "../../components/custom";
import { Skeleton } from "../../components/pure";
import { type RoleOld, RoleSlice, RoleValidationRules } from "../../entities";
import { useFormErrors, useValidate } from "../../hooks";
import { fetchSystemPermissions, useAppDispatch, type YusrRootState } from "../../state";

export const ActionIcons: Record<string, React.ReactNode> = {
  [SystemPermissionsActions.Add]: <Plus className="w-4 h-4 text-blue-500" />,
  [SystemPermissionsActions.Update]: <Pencil className="w-4 h-4 text-orange-500" />,
  [SystemPermissionsActions.Delete]: <Trash2 className="w-4 h-4 text-red-500" />
};

export type PermissionSecion = {
  id: string;
  title: string;
  icon: LucideIcon;
  resources: string[];
};

export type ChangeRoleDialogAdditionalProps = {
  additionalTabs?: (role: Partial<RoleOld>) => TabProps[];
  initRequests?: () => void;
  permissionSecions: PermissionSecion[];
  labels: Record<string, string>;
};

export function ChangeRoleDialog(
  { entity, mode, service, onSuccess, additionalTabs, initRequests, permissionSecions, labels }:
    & CommonChangeDialogPropsOld<RoleOld>
    & ChangeRoleDialogAdditionalProps
)
{
  const { t } = useTranslation(["commonEntities", "common"]);
  const delimiter: string = ".";
  const { formData, errors } = useSelector((state: YusrRootState) => state.roleForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    RoleValidationRules.validationRules(t),
    (errors) => dispatch(RoleSlice.formActions.setErrors(errors))
  );

  const systemState = useSelector((state: YusrRootState) => state.system);
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

  useEffect(() =>
  {
    initRequests?.();
  }, [dispatch, initRequests]);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      // setInitLoading(true);

      const getRoute = async () =>
      {
        const res = await service.Get(entity.id);
        dispatch(RoleSlice.formActions.setInitialData({ ...res.data }));
        // setInitLoading(false);
      };

      getRoute();
    }
    else
    {
      dispatch(RoleSlice.formActions.setInitialData(entity ?? {}));
    }
  }, [entity?.id, mode]);

  const categorized = useMemo(() =>
  {
    return permissionSecions.map((section) => ({
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
            label={ labels[item.resource] || item.resource }
            masterPermission={ item.get }
            isMasterRequired={ item.resource === YusrSystemPermissionsResources.Settings }
            selectedPermissions={ formData.permissions || [] }
            onToggle={ (updated) => dispatch(RoleSlice.formActions.updateFormData({ permissions: updated })) }
            actions={ item.actions.map((perm) => ({
              id: perm,
              label: labels[perm.split(delimiter)[1]] || perm.split(delimiter)[1],
              icon: ActionIcons[perm.split(delimiter)[1]]
            })) }
          />
        )) }
    </div>
  );

  const permissionTabs: TabProps[] = categorized.map((section, index) => ({
    active: index === 0,
    icon: section.icon,
    label: section.title,
    content: (
      <div className="space-y-4">
        { index === 0 && (
          <TextFieldOld
            label={ t("roles.roleName") }
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
    hasError: index === 0 ? isInvalid("name") : undefined
  }));

  const tabs: TabProps[] = [...permissionTabs, ...(additionalTabs?.(formData) ?? [])];

  return (
    <ChangeDialogTabbed<RoleOld>
      changeDialogProps={ {
        title: mode === "create" ? t("roles.addNewTitle") : `${t("common:crudRow.edit")} ${t("roles.entityName")}`,
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
