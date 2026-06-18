import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../pure/button";
import { ContextMenuContent, ContextMenuGroup, ContextMenuItem } from "../../pure/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../pure/dropdown-menu";
import React from "react";
import { type ChangeableEntity, type Dto } from "../../../stateManager";


type ListType = "dropdown" | "context";

export type CrudTableRowActionsMenuProps<TEntity extends ChangeableEntity<TDto>, TDto extends Dto> = {
	entity: TEntity,
	type?: ListType;
	onEditClicked: () => void;
	onDeleteClicked: () => void;
	hasUpdatePermission: ((entity: TEntity) => boolean) | boolean;
	hasDeletePermission: ((entity: TEntity) => boolean) | boolean;
	dropdownItems?: React.ReactNode[];
	contextMenuItems?: React.ReactNode[];
};

export function CrudTableRowActionsMenu<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
	{
		entity,
		onEditClicked,
		onDeleteClicked,
		type,
		hasUpdatePermission,
		hasDeletePermission,
		dropdownItems,
		contextMenuItems
	}:
	CrudTableRowActionsMenuProps<TEntity, TDto>
)
{
	const {t, i18n} = useTranslation("common");

	return (
		<>
			{ type === "dropdown" && (
				<DropdownMenu dir={ i18n.dir() }>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
							<MoreHorizontal className="h-4 w-4"/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{ (typeof hasUpdatePermission === "function" ? hasUpdatePermission(entity) : hasUpdatePermission) && (
							<DropdownMenuItem className="text-amber-500 font-semibold" onSelect={ onEditClicked }>
								<Edit className="me-2 h-4 w-4"/>
								{ t("crudRow.edit") }
							</DropdownMenuItem>
						) }
						{ dropdownItems }
						{ (typeof hasDeletePermission === "function" ? hasDeletePermission(entity) : hasDeletePermission) && (
							<DropdownMenuItem className="text-destructive font-semibold" onSelect={ onDeleteClicked }>
								<Trash className="me-2 h-4 w-4"/>
								{ t("crudRow.delete") }
							</DropdownMenuItem>
						) }
					</DropdownMenuContent>
				</DropdownMenu>
			) }

			{ type === "context" && (
				<ContextMenuContent>
					<ContextMenuGroup dir={ i18n.dir() }>
						{ (typeof hasUpdatePermission === "function" ? hasUpdatePermission(entity) : hasUpdatePermission) && (
							<ContextMenuItem className="text-amber-500 font-semibold" onSelect={ onEditClicked }>
								<Edit className="me-2 h-4 w-4"/>
								{ t("crudRow.edit") }
							</ContextMenuItem>
						) }
						{ contextMenuItems }
						{ (typeof hasDeletePermission === "function" ? hasDeletePermission(entity) : hasDeletePermission) && (
							<ContextMenuItem className="text-destructive font-semibold" onSelect={ onDeleteClicked }>
								<Trash className="me-2 h-4 w-4"/>
								{ t("crudRow.delete") }
							</ContextMenuItem>
						) }
					</ContextMenuGroup>
				</ContextMenuContent>
			) }
		</>
	);
}
