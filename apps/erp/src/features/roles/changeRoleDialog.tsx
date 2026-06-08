import type { ErpRole, ErpRoleDto } from "@/core/data/erpRole";
import { Services } from "@/core/services/services";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { type LucideIcon, Pencil, Plus, Trash2, WarehouseIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { categorizePermissions, ChangeDialog, type ChangeDialogTabProps, type CommonChangeDialogProps, Loading, PermissionCard, SystemApiService, SystemPermissionsActions, TextField, YusrSystemPermissionsResources } from "yusr-ui";
import { StoreCubit } from "../stores/state/storeCubit";
import { getLabels, getPermissionSections } from "./permissionConfig";
import StorePermissionsList from "./storePermissionsList";

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

export function ChangeRoleDialog({ entity, service, onSuccess }: CommonChangeDialogProps<ErpRole, ErpRoleDto>)
{
  const { t } = useTranslation(["erpCommon", "commonEntities", "common"]);
  const delimiter = ".";
  const storesCubit = useMemo(() => new StoreCubit(), []);
  const isLoading = useMemo(() => signal(false), []);
  const labels = getLabels(t);
  const permissionSecions = getPermissionSections(t);

  useEffect(() =>
  {
    const fetch = async () =>
    {
      isLoading.value = true;
      if (Services.auth.systemPermissions.value.length === 0)
      {
        const res = await new SystemApiService().GetSystemPermissions();
        Services.auth.systemPermissions.value = res.data ?? [];
      }

      if (entity.mode.value === "create" && Services.auth.systemPermissions.value.length > 0)
      {
        entity.permissions.value = Services.auth.systemPermissions.value;
      }

      if (entity.mode.value === "update" && entity?.id.value)
      {
        const res = await service.Get(entity.id.value);
        if (res.data != undefined)
        {
          entity.id.value = res.data.id.value;
          entity.name.value = res.data.name.value;
          entity.permissions.value = res.data.permissions.value;
          entity.authorizedStores.value = res.data.authorizedStores.value;
        }
      }
      isLoading.value = false;
    };

    fetch();
    storesCubit.initFilterAll();
  }, [entity?.id.value]);

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
          { categorizePermissions(Services.auth.systemPermissions.value, section.resources, delimiter).map((item) => (
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

    if (isLoading.value)
    {
      return <Loading entityName={ t("commonEntities:roles.entityName") } />;
    }

    const tabs = [...permissionTabs, {
      active: false,
      icon: WarehouseIcon,
      label: t("permissions.resources.authorizedStores"),
      content: (
        <StorePermissionsList
          cubit={ storesCubit }
          authorizedStoreIds={ entity.authorizedStores }
        />
      )
    }];

    return (
      <ChangeDialog.Tabbed tabs={ tabs }>
        <ChangeDialog.Footer>
          <ChangeDialog.Close />
          <ChangeDialog.SaveButton<ErpRole, ErpRoleDto>
            entity={ entity }
            service={ service }
            onSuccess={ (data) => onSuccess?.(data) }
          />
        </ChangeDialog.Footer>
      </ChangeDialog.Tabbed>
    );
  }
}
