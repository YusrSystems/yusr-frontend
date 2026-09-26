import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { Store, StoreDto } from "@/core/data/store.ts";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";
import { storesApi } from "./stores.api";


export default function ChangeStoreDialog({dto, onSuccess}: CommonChangeDialogProps<StoreDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const entity = useMemo(() => signal<Store>(dto ? Store.load(dto) : Store.create()), [dto]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;
	const title = !isUpdateMode
		? t("stores.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("stores.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<TextField
					label={ t("stores.storeName") }
					required
					value={ entity.value.name }
					error={ entity.value.getError("name") }
				/>
			</FieldGroup>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<Store, StoreDto>
					entity={ entity }
					resource={ storesApi }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}