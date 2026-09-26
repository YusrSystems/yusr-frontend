import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "#/auth";
import {
	ChangeDialog,
	CitiesSearchableSelect,
	type CommonChangeDialogProps,
	FieldsSection,
	FormField,
	TextField
} from "#/components/custom";
import { FieldGroup } from "#/components/pure";
import { Branch, BranchDto } from "#/entities";
import { BaseCubits, BaseServices } from "#/services";
import { ChangeableEntityMode } from "#/stateManager";
import { signal } from "@preact/signals-react";
import { branchesApi } from "./branches.api";


export function ChangeBranchDialog({dto, onSuccess}: CommonChangeDialogProps<BranchDto>)
{
	useSignals();
	const {t} = useTranslation(["commonEntities", "common"]);
	const entity = useMemo(() => signal<Branch>(dto ? Branch.load(dto) : Branch.create()), [dto]);

	useEffect(() =>
	{
		BaseCubits.cities.init();
	}, []);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Branches, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Branches, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;
	const title = !isUpdateMode
		? t("branches.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("branches.entityName") }`;

	return (
		<ChangeDialog>
			<ChangeDialog.Header title={ title }/>

			<FieldGroup className="py-2">
				<TextField
					label={ t("branches.branchName") }
					required
					value={ entity.value.name }
					error={ entity.value.getError("name") }
				/>

				<FormField
					label={ t("branches.city") }
					required
					error={ entity.value.getError("cityId") }
				>
					<CitiesSearchableSelect
						id={ entity.value.cityId }
						label={ entity.value.cityName }
					/>
				</FormField>

				<FieldsSection title="" columns={ 2 }>
					<TextField
						label={ t("branches.street") }
						value={ entity.value.street }
					/>
					<TextField
						label={ t("branches.district") }
						value={ entity.value.district }
					/>
					<TextField
						label={ t("branches.buildingNumber") }
						value={ entity.value.buildingNumber }
						error={ entity.value.getError("buildingNumber") }
					/>
					<TextField
						label={ t("branches.postalCode") }
						value={ entity.value.postalCode }
						error={ entity.value.getError("postalCode") }
					/>
				</FieldsSection>
			</FieldGroup>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Branch, BranchDto>
					entity={ entity }
					resource={ branchesApi }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}