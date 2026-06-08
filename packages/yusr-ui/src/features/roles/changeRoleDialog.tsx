import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { type LucideIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { categorizePermissions, ChangeDialog, type ChangeDialogTabProps, type CommonChangeDialogProps, Loading, PermissionCard, TextField } from "../../components/custom";
import type { Role, RoleDto } from "../../entities";
import { SystemApiService } from "../../networking";
import { BaseServices } from "../../services";
import type { RequestResult } from "../../types";

export const ActionIcons: Record<string, React.ReactNode> = {
  [SystemPermissionsActions.Add]: <Plus className="w-4 h-4 text-blue-500" />,
  [SystemPermissionsActions.Update]: <Pencil className="w-4 h-4 text-orange-500" />,
  [SystemPermissionsActions.Delete]: <Trash2 className="w-4 h-4 text-red-500" />
};

export type PermissionSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  resources: string[];
};

export type ChangeRoleDialog<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto> = {
  labels: Record<string, string>;
  permissionSecions: PermissionSection[];
  onMount?: () => void;
  onGet?: (entity: TRole, result: RequestResult<TRole>) => void;
  extraTabs?(entity: TRole): ChangeDialogTabProps[];
};

export function ChangeRoleDialog<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>(
  { entity, service, onSuccess, labels, permissionSecions, onGet, onMount, extraTabs }:
    & CommonChangeDialogProps<TRole, TRoleDto>
    & ChangeRoleDialog<TRole, TRoleDto>
)
{
  const { t } = useTranslation(["commonEntities", "common"]);
  const delimiter = ".";
  const isLoading = useMemo(() => signal(false), []);

  useEffect(() =>
  {
    const fetch = async () =>
    {
      isLoading.value = true;
      if (BaseServices.auth.systemPermissions.value.length === 0)
      {
        const res = await new SystemApiService().GetSystemPermissions();
        BaseServices.auth.systemPermissions.value = res.data ?? [];
      }

      if (entity.mode.value === "create" && BaseServices.auth.systemPermissions.value.length > 0)
      {
        entity.permissions.value = BaseServices.auth.systemPermissions.value;
      }

      if (entity.mode.value === "update" && entity?.id.value)
      {
        const res = await service.Get(entity.id.value);
        if (res.data != undefined)
        {
          entity.id.value = res.data.id.value;
          entity.name.value = res.data.name.value;
          entity.permissions.value = res.data.permissions.value;
          onGet?.(entity, res);
        }
      }
      isLoading.value = false;
    };

    fetch();
    onMount?.();
  }, [entity?.id.value]);

  return (
    <ChangeDialog className="sm:max-w-6xl">
      <ChangeDialog.Header
        title={ entity.mode.value === "create"
          ? t("commonEntities:roles.addNewTitle")
          : `${t("common:crudRow.edit")} ${t("commonEntities:roles.entityName")}` }
      />
      <DialogBody />
    </ChangeDialog>
  );

  function DialogBody()
  {
    useSignals();

    const permissionTabs: ChangeDialogTabProps[] = permissionSecions.map((section, index) => ({
      active: index === 0,
      icon: section.icon,
      label: section.title,
      hasError: index === 0 ? !!entity.getError("name").value : undefined,
      content: (
        <div className="space-y-4">
          { index === 0 && (
            <TextField
              label={ t("commonEntities:roles.roleName") }
              required
              value={ entity.name }
              error={ entity.getError("name") }
            />
          ) }
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            { categorizePermissions(BaseServices.auth.systemPermissions.value, section.resources, delimiter).map((
              item
            ) => (
              <PermissionCard
                key={ item.resource }
                resourceId={ item.resource }
                label={ labels[item.resource] || item.resource }
                masterPermission={ item.get }
                isMasterRequired={ item.resource === YusrSystemPermissionsResources.Settings }
                selectedPermissions={ entity.permissions }
                actions={ item.actions.map((perm) => ({
                  id: perm,
                  label: labels[perm.split(delimiter)[1]] || perm.split(delimiter)[1],
                  icon: ActionIcons[perm.split(delimiter)[1]]
                })) }
              />
            )) }
          </div>
        </div>
      )
    }));

    if (isLoading.value)
    {
      return <Loading entityName={ t("commonEntities:roles.entityName") } />;
    }

    const tabs = [...permissionTabs, ...(extraTabs?.(entity) ?? [])];

    return (
      <ChangeDialog.Tabbed tabs={ tabs }>
        <ChangeDialog.Footer>
          <ChangeDialog.Close />
          <ChangeDialog.SaveButton<TRole, TRoleDto>
            entity={ entity }
            service={ service }
            onSuccess={ (data) => onSuccess?.(data) }
          />
        </ChangeDialog.Footer>
      </ChangeDialog.Tabbed>
    );
  }
}
