import { useSignals } from "@preact/signals-react/runtime";
import { Settings2 } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "#/auth";
import { CrudPage, TablePreview, UnauthorizedPage } from "#/components/custom";
import type { Role, RoleDto } from "#/entities";
import { BaseCubits, BaseServices } from "#/services";
import { ChangeableEntityMode, ListCubit, PageError, PageLoaded, PageLoading } from "#/stateManager";
import { ChangeRoleDialog } from "./changeRoleDialog";
import type { ISimpleListResource } from "#/api";
import { rolesApi } from "./roles.api";


export interface RolesPageProps<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>
	extends Omit<React.ComponentProps<typeof ChangeRoleDialog<TRole, TRoleDto>>, "dto" | "resource" | "onSuccess">
{
	resource?: ISimpleListResource<TRoleDto>;
	cubit?: ListCubit<TRoleDto>;
}

export function RolesPage<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>(
	{
		resource = rolesApi as unknown as ISimpleListResource<TRoleDto>,
		cubit = BaseCubits.roles as unknown as ListCubit<TRoleDto>,
		...props
	}: RolesPageProps<TRole, TRoleDto>
)
{
	useSignals();
	const {t} = useTranslation("commonEntities");

	useEffect(() =>
	{
		if (BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Roles, SystemPermissionsActions.Get))
		{
			void cubit.init();
		}
	}, [cubit]);

	if (!BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Roles, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<TRoleDto>>
			<CrudPage.Header
				title={ t("roles.title") }
				addButtonTitle={ t("roles.addNewTitle") }
				isAddButtonVisible={ BaseServices.auth.hasAuth(
					YusrSystemPermissionsResources.Roles,
					SystemPermissionsActions.Add
				) }
			/>
			<RoleCards cubit={ cubit }/>
			<CrudPage.SearchInput onSearch={ (searchText) => cubit.search(searchText) }/>
			<RoleTable cubit={ cubit }/>
			<CrudPage.ChangeDialog<TRoleDto>
				fetchEntity={ async (id) =>
				{
					const res = await resource.get(id);
					return res.data;
				} }
				changeDialog={ (dto: TRoleDto | undefined, closeDialog) => (
					<ChangeRoleDialog<TRole, TRoleDto>
						dto={ dto }
						resource={ resource }
						onSuccess={ (data, mode) =>
						{
							if (mode === ChangeableEntityMode.Create)
							{
								cubit.add(data);
								closeDialog();
							}
							else if (mode === ChangeableEntityMode.Update)
							{
								cubit.update(data);
							}
						} }
						{ ...props }
					/>
				) }
			/>
			<CrudPage.DeleteDialog<TRoleDto>
				entityNameSelector={ (entity) => entity.name }
				resource={ resource }
				onSuccess={ (entity) => cubit.delete(entity) }
			/>
		</CrudPage>
	);
}

function RoleCards<TRoleDto extends RoleDto>({cubit}: { cubit: ListCubit<TRoleDto> })
{
	useSignals();
	const {t} = useTranslation("commonEntities");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("roles.totalRoles"),
				data: cubit.count.value.toString(),
				icon: <Settings2 className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function RoleTable<TRoleDto extends RoleDto>({cubit}: { cubit: ListCubit<TRoleDto> })
{
	useSignals();
	const {t} = useTranslation(["commonEntities", "common"]);

	if (cubit.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}
	if (cubit.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<TRoleDto>
					data={ cubit.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("roles.roleId"), rowStyles: "w-30"},
						{rowBody: t("roles.roleName"), rowStyles: ""}
					] }
					tableRowMapper={ (role) => [
						{rowBody: `#${ role.id }`, rowStyles: ""},
						{rowBody: role.name, rowStyles: "font-semibold"}
					] }
					hasUpdatePermission={ BaseServices.auth.hasAuth(
						YusrSystemPermissionsResources.Roles,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ BaseServices.auth.hasAuth(
						YusrSystemPermissionsResources.Roles,
						SystemPermissionsActions.Delete
					) }
				/>
			</CrudPage.Table>
		);
	}
	if (cubit.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}
	return <TablePreview.Empty/>;
}