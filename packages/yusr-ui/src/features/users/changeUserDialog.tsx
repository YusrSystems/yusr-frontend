import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";
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


export function ChangeUserDialog({entity, service, onSuccess}: CommonChangeDialogProps<User, UserDto>)
{
	useSignals();

	if (
		(entity.mode.value === ChangeableEntityMode.Create
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Users, SystemPermissionsActions.Add))
		|| (entity.mode.value === ChangeableEntityMode.Update
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Users, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const {t} = useTranslation(["commonEntities", "common"]);
	const title = entity.mode.value === ChangeableEntityMode.Create
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
					value={ entity.username }
					error={ entity.getError("username") }
				/>

				<TextField
					label={ t("users.password") }
					required
					value={ entity.password }
					error={ entity.getError("password") }
				/>

				<FormField label={ t("users.role") } required error={ entity.getError("roleId") }>
					<RolesSearchableSelect
						id={ entity.roleId }
						label={ entity.roleName }
					/>
				</FormField>

				<FormField label={ t("users.branch") } required error={ entity.getError("branchId") }>
					<BranchesSearchableSelect
						id={ entity.branchId }
						label={ entity.branchName }
					/>
				</FormField>

				<SelectField
					label={ t("users.userStatus") }
					required
					value={ entity.isActive }
					options={ [{label: t("users.active"), value: true}, {label: t("users.inactive"), value: false}] }
				/>
			</FieldsSection>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<User, UserDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
