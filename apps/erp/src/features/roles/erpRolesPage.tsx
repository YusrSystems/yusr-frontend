import { ErpRole, ErpRoleDto } from "@/core/data/erpRole";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { WarehouseIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RolesPage } from "yusr-ui";
import { getLabels, getPermissionSections } from "./permissionConfig";
import StorePermissionsList from "./storePermissionsList";

export function ErpRolesPage()
{
  const { t } = useTranslation("erpCommon");

  return (
    <RolesPage<ErpRole, ErpRoleDto>
      labels={ getLabels(t) }
      permissionSecions={ getPermissionSections(t) }
      rolesApiService={ Services.rolesApi }
      cubit={ Cubits.roles }
      toEntity={ (dto) =>
        dto
          ? ErpRole.load(dto)
          : ErpRole.create() }
      onMount={ () => Cubits.stores.initFilterAll() }
      onGet={ (entity, result) =>
      {
        if (result.data != undefined)
        {
          entity.authorizedStores.value = result.data?.authorizedStores.value;
        }
      } }
      extraTabs={ (entity) => [{
        active: false,
        icon: WarehouseIcon,
        label: t("permissions.resources.authorizedStores"),
        content: (
          <StorePermissionsList
            authorizedStoreIds={ entity.authorizedStores }
          />
        )
      }] }
    />
  );
}
