import { ErpRole, ErpRoleDto } from "@/core/data/erpRole";
import { Cubits } from "@/core/services/cubits";
import { WarehouseIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RolesPage } from "yusr-ui";
import { getLabels, getPermissionSections, getRolePresets } from "./permissionConfig";
import StorePermissionsList from "./storePermissionsList";
import { APP_NAME } from "../../../appConfig.ts";
import { useEffect } from "react";
import { erpRolesApi } from "./roles.api";


export function ErpRolesPage()
{
	const {t} = useTranslation(["erpCommon", "commonEntities"]);

	useEffect(() =>
	{
		document.title = `${ t("commonEntities:roles.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	return (
		<RolesPage<ErpRole, ErpRoleDto>
			labels={ getLabels(t) }
			permissionSections={ getPermissionSections(t) }
			presets={ getRolePresets(t) }
			resource={ erpRolesApi }
			cubit={ Cubits.roles }
			createEntity={ (dto) => (dto ? ErpRole.load(dto) : ErpRole.create()) }
			onMount={ () => Cubits.stores.init({authOnly: false}) }
			onGet={ (entity, data) =>
			{
				if (data)
				{
					entity.authorizedStores.value = data.authorizedStores ?? [];
				}
			} }
			extraTabs={ (entity) => [
				{
					active: false,
					icon: WarehouseIcon,
					label: t("permissions.resources.authorizedStores"),
					content: (
						<StorePermissionsList
							authorizedStoreIds={ entity.authorizedStores }
						/>
					)
				}
			] }
		/>
	);
}