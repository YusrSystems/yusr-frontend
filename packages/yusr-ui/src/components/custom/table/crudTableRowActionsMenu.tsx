import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ResourcePermissions } from "../../../auth";
import { Button } from "../../pure/button";
import { ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator } from "../../pure/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../pure/dropdown-menu";

type ListType = "dropdown" | "context";

export interface CrudTableRowActionsMenuProps
{
  onEditClicked: () => void;
  onDeleteClicked: () => void;
  type: ListType;
  permissions: ResourcePermissions;
  dorpdownItems?: React.ReactNode[];
  contextMenuItems?: React.ReactNode[];
}

export function CrudTableRowActionsMenu(
  { onEditClicked, onDeleteClicked, type, permissions, dorpdownItems, contextMenuItems }: CrudTableRowActionsMenuProps
)
{
  const { t, i18n } = useTranslation("common");

  return (
    <>
      { type === "dropdown" && (
        <DropdownMenu dir={ i18n.dir() }>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            { permissions.updatePermission && (
              <DropdownMenuItem className="text-amber-500 font-semibold" onSelect={ onEditClicked }>
                <Edit className="me-2 h-4 w-4" />
                { t("crudRow.edit") }
              </DropdownMenuItem>
            ) }
            { dorpdownItems }
            { permissions.deletePermission && (
              <DropdownMenuItem className="text-destructive font-semibold" onSelect={ onDeleteClicked }>
                <Trash className="me-2 h-4 w-4" />
                { t("crudRow.delete") }
              </DropdownMenuItem>
            ) }
          </DropdownMenuContent>
        </DropdownMenu>
      ) }

      { type === "context" && (
        <ContextMenuContent>
          <ContextMenuGroup>
            { permissions.updatePermission && (
              <ContextMenuItem className="text-amber-500 font-semibold" onSelect={ onEditClicked }>
                <Edit className="me-2 h-4 w-4" />
                { t("crudRow.edit") }
              </ContextMenuItem>
            ) }
            { contextMenuItems }
            { permissions.deletePermission && (
              <ContextMenuItem className="text-destructive font-semibold" onSelect={ onDeleteClicked }>
                <Trash className="me-2 h-4 w-4" />
                { t("crudRow.delete") }
              </ContextMenuItem>
            ) }
          </ContextMenuGroup>
        </ContextMenuContent>
      ) }
    </>
  );
}
