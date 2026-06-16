import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import type { CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, SystemPermissionsActions, TextField } from "yusr-ui";
import { Store, StoreDto } from "@/core/data/store.ts";


export default function ChangeStoreDialog({entity, service, onSuccess}: CommonChangeDialogProps<Store, StoreDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (
		(entity.mode.value === "create"
			&& !Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Add))
		|| (entity.mode.value === "update"
			&& !Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.mode.value === "create"
		? t("stores.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("stores.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<TextField
					label={ t("stores.storeName") }
					required
					value={ entity.name }
					error={ entity.getError("name") }
				/>
			</FieldGroup>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Store, StoreDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}