import { ErpRole } from "@/core/data/erpRole";
import { Services } from "@/core/services/services";
import { WarehouseIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RolesPage } from "yusr-ui";
import { StoreCubit } from "../stores/state/storeCubit";
import { getLabels, getPermissionSections } from "./permissionConfig";
import StorePermissionsList from "./storePermissionsList";

export function ErpRolesPage()
{
  const storesCubit = useMemo(() => new StoreCubit(), []);
  const { t } = useTranslation("erpCommon");

  return (
    <RolesPage
      labels={ getLabels(t) }
      permissionSecions={ getPermissionSections(t) }
      rolesApiService={ Services.rolesApi }
      toEntity={ (dto) =>
        dto
          ? ErpRole.load(dto)
          : ErpRole.create({
            id: 0,
            name: "",
            permissions: [],
            authorizedStores: []
          }) }
      onMount={ () => storesCubit.initFilterAll() }
      onGet={ (entity, result) =>
      {
        if (result.data != undefined)
        {
          console.log(result.data.authorizedStores.value);
          entity.authorizedStores.value = result.data?.authorizedStores.value;
          console.log(entity.authorizedStores.value);
        }
      } }
      extraTabs={ (entity) => [{
        active: false,
        icon: WarehouseIcon,
        label: t("permissions.resources.authorizedStores"),
        content: (
          <StorePermissionsList
            cubit={ storesCubit }
            authorizedStoreIds={ entity.authorizedStores }
          />
        )
      }] }
    />
  );
}
