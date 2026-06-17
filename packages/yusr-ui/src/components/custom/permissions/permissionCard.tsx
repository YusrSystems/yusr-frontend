import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, Checkbox, Label } from "../../pure";
import React from "react";


export interface PermissionCardProps
{
	resourceId: string;
	label: string;
	masterPermission?: string | null;
	actions: { id: string; label: string; icon?: React.ReactNode; }[];
	selectedPermissions: Signal<string[]>;
	isMasterRequired?: boolean;
}

export interface PermissionGroup
{
	resource: string;
	get: string | null;
	actions: string[];
}

export const categorizePermissions = (
	systemPermissions: string[],
	order: string[],
	delimiter: string = "."
): PermissionGroup[] =>
{
	const groups = systemPermissions.reduce((acc, perm) =>
	{
		const [resource, action] = perm.split(delimiter);
		if (!resource) return acc;

		if (!acc[resource])
		{
			acc[resource] = {get: null, actions: []};
		}
		if (action === "Get")
		{
			acc[resource].get = perm;
		}
		else
		{
			acc[resource].actions.push(perm);
		}
		return acc;
	}, {} as Record<string, { get: string | null; actions: string[]; }>);

	return order.flatMap((key) =>
	{
		const group = groups[key];
		return group ? [{resource: key, ...group}] : [];
	});
};

export function PermissionCard(
	{resourceId, label, masterPermission, actions, selectedPermissions, isMasterRequired = false}: PermissionCardProps
)
{
	useSignals();

	const hasMaster = isMasterRequired
		? true
		: masterPermission
			? selectedPermissions.value.includes(masterPermission)
			: false;

	const toggleGetPermission = (resource: string) =>
	{
		const current = selectedPermissions.value;
		const isSelected = current.includes(masterPermission!);

		if (isSelected)
		{
			selectedPermissions.value = current.filter((p) => !p.startsWith(`${ resource }`));
		}
		else
		{
			const toAdd = [masterPermission!, ...actions.map((a) => a.id)];
			selectedPermissions.value = [...current, ...toAdd];
		}
	};

	const handleToggle = (resourceId: string) =>
	{
		const current = selectedPermissions.value;
		selectedPermissions.value = current.includes(resourceId)
			? current.filter((id) => id !== resourceId)
			: [...current, resourceId];
	};

	return (
		<Card className="shadow-none border-2">
			<CardHeader className="flex flex-row items-center justify-between border-b py-3 px-4">
				<div className="flex items-center gap-2">
					<ShieldCheck className="w-4 h-4 text-primary"/>
					<span className="font-bold text-sm">{ label }</span>
				</div>
				{ masterPermission && !isMasterRequired && (
					<Checkbox
						checked={ hasMaster }
						onCheckedChange={ () => toggleGetPermission(resourceId) }
					/>
				) }
			</CardHeader>
			<CardContent className="p-2 space-y-1">
				{ actions.map((action) => (
					<div
						key={ action.id }
						className={ `flex items-center justify-between p-2 rounded-sm transition-opacity ${
							!hasMaster ? "opacity-40 select-none" : "hover:bg-muted"
						}` }
					>
						<div className="flex items-center gap-3">
							{ action.icon }
							<Label className="text-xs cursor-pointer">{ action.label }</Label>
						</div>
						<Checkbox
							disabled={ !hasMaster }
							checked={ selectedPermissions.value.includes(action.id) }
							onCheckedChange={ () => handleToggle(action.id) }
						/>
					</div>
				)) }
			</CardContent>
		</Card>
	);
}
