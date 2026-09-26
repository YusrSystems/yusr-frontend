import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "#/auth";
import {
	BranchesSearchableSelect,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldsSection,
	FormField,
	PasswordField,
	RolesSearchableSelect,
	SaveButton,
	SelectField,
	TextField
} from "#/components/custom";
import { User, UserDto } from "#/entities";
import { BaseCubits, BaseServices } from "#/services";
import { ChangeableEntityMode } from "#/stateManager";
import { signal } from "@preact/signals-react";
import { usersApi } from "./users.api";
import { KeyRound } from "lucide-react";


export function ChangeUserDialog({dto, onSuccess}: CommonChangeDialogProps<UserDto>)
{
	useSignals();
	const entity = useMemo(() => signal<User>(dto ? User.load(dto) : User.create()), [dto]);
	const newPassword = useMemo(() => signal(""), []);
	const {t} = useTranslation(["commonEntities", "common"]);

	useEffect(() =>
	{
		BaseCubits.branches.init();
		BaseCubits.roles.init();
	}, []);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Users, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Users, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;
	const title = !isUpdateMode
		? t("users.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("users.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-lg">
			<ChangeDialog.Header title={ title }/>
			<div className="flex flex-col gap-6 py-2">
				<FieldsSection columns={ 2 }>
					<TextField
						label={ t("users.username") }
						required
						value={ entity.value.username }
						error={ entity.value.getError("username") }
					/>
					{ !isUpdateMode && (
						<PasswordField
							label={ t("users.password") }
							required
							value={ entity.value.password }
							error={ entity.value.getError("password") }
						/>
					) }
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
					<div className="col-span-2">
						<SelectField
							label={ t("users.userStatus") }
							required
							value={ entity.value.isActive }
							options={ [
								{label: t("users.active"), value: true},
								{label: t("users.inactive"), value: false}
							] }
						/>
					</div>
				</FieldsSection>

				{ isUpdateMode && (
					<div className="rounded-lg border bg-muted/20 p-4 space-y-3">
						<div className="flex items-center gap-2 font-medium text-sm text-foreground">
							<KeyRound className="w-4 h-4 text-primary"/>
							<span>تغيير كلمة المرور</span>
						</div>
						<div className="flex gap-2 items-end">
							<div className="flex-1">
								<PasswordField
									placeholder="أدخل كلمة المرور الجديدة"
									value={ newPassword }
								/>
							</div>
							<SaveButton
								label="تحديث كلمة المرور"
								variant="outline"
								className="h-8 text-xs font-semibold"
								disabled={ newPassword.value.length < 1 }
								action={ async () =>
								{
									const res = await usersApi.updatePassword(entity.value.id.value, {
										newPassword: newPassword.value
									});
									if (res.ok)
									{
										newPassword.value = "";
									}
									return res;
								} }
							/>
						</div>
					</div>
				) }
			</div>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<User, UserDto>
					entity={ entity }
					resource={ usersApi }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}