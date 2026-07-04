import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import Unit, { UnitDto } from "@/core/data/unit";
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
import { useMemo } from "react";
import { signal } from "@preact/signals-react";


export default function ChangeUnitDialog({dto, service, onSuccess}: CommonChangeDialogProps<UnitDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const entity = useMemo(() => signal<Unit>(dto ? Unit.load(dto) : Unit.create()), []);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("units.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("units.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<TextField
					label={ t("units.unitName") }
					required
					value={ entity.value.name }
					error={ entity.value.getError("name") }
				/>
			</FieldGroup>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Unit, UnitDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
