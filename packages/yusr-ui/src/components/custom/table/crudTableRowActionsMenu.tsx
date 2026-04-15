import { Button } from "../../pure/button";
import { ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator } from "../../pure/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../pure/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { ResourcePermissions } from "yusr-core";

type ListType = "dropdown" | "context";

interface Props {
  onEditClicked: () => void;
  onDeleteClicked: () => void;
  type: ListType;
  permissions: ResourcePermissions;
}

export function CrudTableRowActionsMenu({ onEditClicked, onDeleteClicked, type, permissions }: Props) {
  return (
    <>
      {type === "dropdown" && (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            {permissions.updatePermission && <DropdownMenuItem onSelect={onEditClicked}>تعديل</DropdownMenuItem>}
            {permissions.deletePermission && (
              <DropdownMenuItem className="text-destructive" onSelect={onDeleteClicked}>حذف</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {type === "context" && (
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>الإجراءات</ContextMenuLabel>
            <ContextMenuSeparator></ContextMenuSeparator>
            {permissions.updatePermission && <ContextMenuItem onSelect={onEditClicked}>تعديل</ContextMenuItem>}
            {permissions.deletePermission && (
              <ContextMenuItem className="text-destructive" onSelect={onDeleteClicked}>حذف</ContextMenuItem>
            )}
          </ContextMenuGroup>
        </ContextMenuContent>
      )}
    </>
  );
}
