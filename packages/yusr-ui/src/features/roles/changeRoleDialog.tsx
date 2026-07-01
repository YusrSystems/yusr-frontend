import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { type LucideIcon, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import {
	categorizePermissions,
	ChangeDialog,
	type ChangeDialogTabProps,
	type CommonChangeDialogProps,
	Loading,
	PermissionCard,
	TextField
} from "../../components/custom";
import type { Role, RoleDto } from "../../entities";
import { SystemApiService } from "../../networking";
import { BaseServices } from "../../services";
import type { RequestResult } from "../../types";
import { ChangeableEntityMode } from "../../stateManager";


export const ActionIcons: Record<string, React.ReactNode> = {
	[SystemPermissionsActions.Add]: <Plus className="w-4 h-4 text-blue-500"/>,
	[SystemPermissionsActions.Update]: <Pencil className="w-4 h-4 text-orange-500"/>,
	[SystemPermissionsActions.Delete]: <Trash2 className="w-4 h-4 text-red-500"/>
};

export type PermissionSection = {
	id: string;
	title: string;
	icon: LucideIcon;
	resources: string[];
};

export type ChangeRoleDialog<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto> = {
	labels: Record<string, string>;
	permissionSections: PermissionSection[];
	createEntity: (dto?: TRoleDto) => TRole;
	onMount?: () => void;
	onGet?: (entity: TRole, result: RequestResult<TRoleDto>) => void;
	extraTabs?(entity: TRole): ChangeDialogTabProps[];
};

export function ChangeRoleDialog<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>(
	{dto, service, onSuccess, labels, permissionSections, createEntity, onGet, onMount, extraTabs}:
	& CommonChangeDialogProps<TRoleDto>
		& ChangeRoleDialog<TRole, TRoleDto>
)
{
	const {t} = useTranslation(["commonEntities", "common"]);
	const entity = useMemo(() => signal<TRole>(createEntity(dto)), []);
	const delimiter = ".";
	const isLoading = useMemo(() => signal(false), []);

	useEffect(() =>
	{
		const fetch = async () =>
		{
			isLoading.value = true;
			if (BaseServices.auth.systemPermissions.value.length === 0)
			{
				const res = await new SystemApiService().GetSystemPermissions();
				BaseServices.auth.systemPermissions.value = res.data ?? [];
			}

			if (entity.value.mode.value === ChangeableEntityMode.Create && BaseServices.auth.systemPermissions.value.length > 0)
			{
				entity.value.permissions.value = BaseServices.auth.systemPermissions.value;
			}

			if (entity.value.mode.value === ChangeableEntityMode.Update && entity.value?.id.value)
			{
				const res = await service.Get(entity.value.id.value);
				if (res.data != undefined)
				{
					entity.value.id.value = res.data.id;
					entity.value.name.value = res.data.name;
					entity.value.permissions.value = res.data.permissions;
					onGet?.(entity.value, res);
				}
			}
			isLoading.value = false;
		};

		fetch();
		onMount?.();
	}, [entity.value?.id.value]);

	return (
		<ChangeDialog className="sm:max-w-6xl">
			<ChangeDialog.Header
				title={ entity.value.mode.value === ChangeableEntityMode.Create
					? t("commonEntities:roles.addNewTitle")
					: `${ t("common:crudRow.edit") } ${ t("commonEntities:roles.entityName") }` }
			/>
			<DialogBody/>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<TRole, TRoleDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);

	function DialogBody()
	{
		useSignals();

		const permissionTabs: ChangeDialogTabProps[] = permissionSections.map((section, index) => ({
			active: index === 0,
			icon: section.icon,
			label: section.title,
			hasError: index === 0 ? !!entity.value.getError("name").value : undefined,
			content: (
				<div className="space-y-4">
					{ index === 0 && (
						<TextField
							label={ t("commonEntities:roles.roleName") }
							required
							value={ entity.value.name }
							error={ entity.value.getError("name") }
						/>
					) }
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{ categorizePermissions(BaseServices.auth.systemPermissions.value, section.resources, delimiter).map((
							item
						) => (
							<PermissionCard
								key={ item.resource }
								resourceId={ item.resource }
								label={ labels[item.resource] || item.resource }
								masterPermission={ item.get }
								isMasterRequired={ item.resource === YusrSystemPermissionsResources.Settings }
								selectedPermissions={ entity.value.permissions }
								actions={ item.actions.flatMap((perm) =>
								{
									const action = perm.split(delimiter)[1];
									if (!action) return [];
									return [{
										id: perm,
										label: labels[action] || action,
										icon: ActionIcons[action]
									}];
								}) }
							/>
						)) }
					</div>
				</div>
			)
		}));

		if (isLoading.value)
		{
			return <Loading entityName={ t("commonEntities:roles.entityName") }/>;
		}

		const tabs = [...permissionTabs, ...(extraTabs?.(entity.value) ?? [])];

		return <ChangeDialog.Tabbed tabs={ tabs }/>;
	}
}
