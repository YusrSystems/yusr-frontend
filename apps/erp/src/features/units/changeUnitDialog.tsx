import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import Unit, { UnitDto } from "@/core/data/unit";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { ChangeableEntityMode, type CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, SystemPermissionsActions, TextField } from "yusr-ui";


export default function ChangeUnitDialog({entity, service, onSuccess}: CommonChangeDialogProps<Unit, UnitDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (
		(entity.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add))
		|| (entity.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.mode.value === ChangeableEntityMode.Create
		? t("units.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("units.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<TextField
					label={ t("units.unitName") }
					required
					value={ entity.name }
					error={ entity.getError("name") }
				/>
			</FieldGroup>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Unit, UnitDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
