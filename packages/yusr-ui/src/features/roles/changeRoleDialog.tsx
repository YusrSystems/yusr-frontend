import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { type LucideIcon, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "#/auth";
import {
	categorizePermissions,
	ChangeDialog,
	type ChangeDialogTabProps,
	Loading,
	PermissionCard,
	SelectField,
	TextField
} from "#/components/custom";
import type { Role, RoleDto } from "#/entities";
import { BaseServices } from "#/services";
import { ChangeableEntityMode } from "#/stateManager";
import type { ISimpleListResource } from "#/api";
import { rolesApi } from "./roles.api";
import { systemApi } from "#/features/system/system.api.ts";


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

export type RolePreset<TRole = any> = {
	id: string;
	name: string;
	description?: string;
	permissions: string[] | (() => string[]);
	onApply?: (entity: TRole) => void;
};

export type ChangeRoleDialogProps<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto> = {
	dto?: TRoleDto;
	resource?: ISimpleListResource<TRoleDto>;
	onSuccess?: (newData: TRoleDto, mode: ChangeableEntityMode) => void;
	labels: Record<string, string>;
	permissionSections: PermissionSection[];
	presets?: RolePreset<TRole>[];
	onApplyPreset?: (preset: RolePreset<TRole>, entity: TRole) => void;
	createEntity: (dto?: TRoleDto) => TRole;
	onMount?: () => void;
	onGet?: (entity: TRole, data: TRoleDto) => void;
	extraTabs?: (entity: TRole) => ChangeDialogTabProps[];
};

export function ChangeRoleDialog<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>(
	{
		dto,
		resource = rolesApi as unknown as ISimpleListResource<TRoleDto>,
		onSuccess,
		labels,
		permissionSections,
		presets,
		onApplyPreset,
		createEntity,
		onGet,
		onMount,
		extraTabs
	}: ChangeRoleDialogProps<TRole, TRoleDto>
)
{
	const {t} = useTranslation(["commonEntities", "common"]);
	const entity = useMemo(() => signal<TRole>(createEntity(dto)), [dto]);
	const selectedPresetId = useMemo(() => signal<string | undefined>(undefined), []);
	const delimiter = ".";
	const isLoading = useMemo(() => signal(false), []);

	useEffect(() =>
	{
		const fetch = async () =>
		{
			isLoading.value = true;
			if (BaseServices.auth.systemPermissions.value.length === 0)
			{
				const res = await systemApi.getPermissions();
				BaseServices.auth.systemPermissions.value = res.data ?? [];
			}
			if (entity.value.mode.value === ChangeableEntityMode.Create && BaseServices.auth.systemPermissions.value.length > 0)
			{
				entity.value.permissions.value = BaseServices.auth.systemPermissions.value;
			}
			if (entity.value.mode.value === ChangeableEntityMode.Update && entity.value?.id.value)
			{
				const res = await resource.get(entity.value.id.value);
				if (res.data !== undefined)
				{
					entity.value.id.value = res.data.id;
					entity.value.name.value = res.data.name;
					entity.value.permissions.value = res.data.permissions;
					onGet?.(entity.value, res.data);
				}
			}
			isLoading.value = false;
		};
		void fetch();
		onMount?.();
	}, [entity.value?.id.value]);

	const handleApplyPreset = (presetId: string | undefined) =>
	{
		if (!presetId || !presets) return;
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
		const perms = typeof preset.permissions === "function" ? preset.permissions() : preset.permissions;
		entity.value.permissions.value = [...perms];
		if (!entity.value.name.value?.trim())
		{
			entity.value.name.value = preset.name;
		}
		preset.onApply?.(entity.value);
		onApplyPreset?.(preset, entity.value);
	};

	return (
		<ChangeDialog className="sm:max-w-6xl max-h-[94dvh] flex flex-col overflow-hidden">
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
					resource={ resource }
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
				<div className="space-y-4 min-w-0">
					{ index === 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<TextField
								label={ t("commonEntities:roles.roleName") }
								required
								value={ entity.value.name }
								error={ entity.value.getError("name") }
							/>
							{ presets && presets.length > 0 && (
								<SelectField<string | undefined>
									label={ t("commonEntities:roles.preset", "تطبيق قالب جاهز") }
									value={ selectedPresetId }
									placeholder={ t("commonEntities:roles.selectPreset", "اختر قالباً جاهزاً...") }
									options={ presets.map((preset) => ({
										label: preset.name,
										value: preset.id
									})) }
									onValueChange={ (val) =>
									{
										selectedPresetId.value = val;
										handleApplyPreset(val);
									} }
								/>
							) }
						</div>
					) }
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
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