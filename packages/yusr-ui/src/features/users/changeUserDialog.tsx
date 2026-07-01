import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import {
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldsSection,
	FormField,
	RolesSearchableSelect,
	SelectField,
	TextField
} from "../../components/custom";
import { BranchesSearchableSelect } from "../../components/custom/select/branchesSearchableSelect";
import { User, UserDto } from "../../entities";
import { BaseCubits, BaseServices } from "../../services";
import { ChangeableEntityMode } from "../../stateManager";
import { signal } from "@preact/signals-react";


export function ChangeUserDialog({dto, service, onSuccess}: CommonChangeDialogProps<UserDto>)
{
	useSignals();

	const entity = useMemo(() => signal<User>(dto ? User.load(dto) : User.create()), []);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Users, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Users, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const {t} = useTranslation(["commonEntities", "common"]);
	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("users.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("users.entityName") }`;

	useEffect(() =>
	{
		BaseCubits.branches.init();
		BaseCubits.roles.init();
	}, []);

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>

			<FieldsSection columns={ 2 }>
				<TextField
					label={ t("users.username") }
					required
					value={ entity.value.username }
					error={ entity.value.getError("username") }
				/>

				<TextField
					label={ t("users.password") }
					required
					value={ entity.value.password }
					error={ entity.value.getError("password") }
				/>

				<FormField label={ t("users.role") } required error={ entity.value.getError("roleId") }>
					<RolesSearchableSelect
						id={ entity.value.roleId }
						label={ entity.value.roleName }
					/>
				</FormField>

				<FormField label={ t("users.branch") } required error={ entity.value.getError("branchId") }>
					<BranchesSearchableSelect
						id={ entity.value.branchId }
						label={ entity.value.branchName }
					/>
				</FormField>

				<SelectField
					label={ t("users.userStatus") }
					required
					value={ entity.value.isActive }
					options={ [{label: t("users.active"), value: true}, {label: t("users.inactive"), value: false}] }
				/>
			</FieldsSection>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<User, UserDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
