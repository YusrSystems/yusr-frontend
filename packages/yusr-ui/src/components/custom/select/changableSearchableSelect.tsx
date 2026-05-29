import type { ActionCreatorWithPayload, AsyncThunk } from "@reduxjs/toolkit";
import { Edit } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { SystemPermissions, SystemPermissionsActions } from "../../../auth";
import { BaseEntity } from "../../../entities";
import type { BaseApiService } from "../../../networking";
import type { IEntityState } from "../../../state";
import { type FilterResult, ResultStatus } from "../../../types";
import { Button, Dialog } from "../../pure";
import type { DialogMode } from "../dialogs/dialogType";
import { type BasicSearchableSelectParams, SearchableSelect } from "./searchableSelect";

type BaseDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiService<T>;
  onSuccess: (data: T) => void;
};

export type ChangableSearchableSelectParams<T extends BaseEntity, TDialogProps extends object = {}> =
  & BasicSearchableSelectParams<T>
  & {
    mode?: "dialog" | "inline";
    labelKey: keyof T;
    createKey?: keyof T;
    renderContent?: (item: T) => React.ReactNode;
    state: IEntityState<T>;
    apiService: BaseApiService<T>;
    systemPermissionsResources: string;
    allowAdd?: boolean;
    allowUpdate?: boolean;
    entityActions: {
      filter: AsyncThunk<FilterResult<T> | undefined, string | undefined, object>;
      refresh: ActionCreatorWithPayload<{ data?: T; deletedId?: number; }>;
    };
    changeDialog?: React.ComponentType<BaseDialogProps<T> & TDialogProps>;
    changeDialogProps?: TDialogProps;
    authPermissions: string[];
  };

export function ChangableSearchableSelect<T extends BaseEntity, TDialogProps extends object = {}>(
  {
    mode = "dialog",
    labelKey,
    createKey,
    renderContent,
    items,
    selectedId,
    selectedLabel,
    state,
    apiService,
    disabled,
    isInvalid,
    systemPermissionsResources,
    allowAdd = true,
    allowUpdate = true,
    onValueChange,
    entityActions,
    changeDialog = undefined,
    changeDialogProps,
    authPermissions,
    ...props
  }: ChangableSearchableSelectParams<T, TDialogProps>
)
{
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<DialogMode>("create");
  const [searchInput, setSearchInput] = React.useState<string>("");

  const dispatch = useDispatch();

  const ChangeDialog = changeDialog;

  // Derive from items first, fall back to constructing a minimal entity from selectedId/selectedLabel
  // This ensures the Edit button always shows when there's a selectedId,
  // even if the item isn't in the current page (e.g. update mode initial load)
  const allItems = items ?? state.entities?.data ?? [];
  const selectedEntity = allItems.find((t: T) => t.id === selectedId)
    ?? (selectedId ? { id: selectedId, [labelKey]: selectedLabel } as unknown as T : undefined);

  const hasAuth = (action: string) =>
    SystemPermissions.hasAuth(authPermissions ?? [], systemPermissionsResources, action);

  const showUpdateButton = hasAuth(SystemPermissionsActions.Update) && allowUpdate;

  const createEntity = (searchText?: string): T =>
  {
    if (createKey)
    {
      return { [createKey]: searchText ?? "" } as unknown as T;
    }

    return {} as unknown as T;
  };

  return (
    <div className="flex w-full">
      <div className="flex-9">
        <SearchableSelect
          renderContent={ renderContent
            ?? ((item) => <span className="flex-1 truncate">{ String(item[labelKey]) }</span>) }
          selectedId={ selectedId }
          selectedLabel={ selectedLabel }
          items={ allItems }
          buttonClassName={ showUpdateButton && selectedEntity ? "rounded-e-none" : "" }
          onSearch={ (searchInput) => dispatch(entityActions.filter(searchInput) as any) }
          isLoading={ state.isLoading }
          disabled={ state.isLoading || disabled }
          isInvalid={ isInvalid }
          onValueChange={ onValueChange }
          onNotFound={ hasAuth(SystemPermissionsActions.Add) && allowAdd
            ? async (searchInput) =>
            {
              if (mode === "inline")
              {
                // create directly, no dialog
                const res = await apiService.Add(
                  createEntity(searchInput)
                );
                if (res.status === ResultStatus.Ok && res.data)
                {
                  dispatch(entityActions.refresh({ data: res.data }));
                  dispatch(entityActions.filter() as any);
                  onValueChange(res.data);
                }
              }
              else
              {
                setSearchInput(searchInput);
                setDialogMode("create");
                dispatch(entityActions.filter() as any);
                setOpenDialog(true);
              }
            }
            : undefined }
          onDelete={ hasAuth(SystemPermissionsActions.Delete)
            ? async (entity) =>
            {
              const res = await apiService.Delete(entity.id);
              if (res.status === ResultStatus.Ok)
              {
                dispatch(entityActions.refresh({ deletedId: entity.id }));
                return true;
              }
              return false;
            }
            : undefined }
          { ...props }
        />
      </div>

      { selectedEntity && showUpdateButton && (
        <Button
          variant="secondary"
          className="flex-1 rounded-s-none border-border"
          onClick={ () =>
          {
            setDialogMode("update");
            setOpenDialog(true);
          } }
        >
          <Edit className="h-4 w-4" />
        </Button>
      ) }

      { openDialog && ChangeDialog && (
        <Dialog open={ openDialog } onOpenChange={ setOpenDialog }>
          <ChangeDialog
            { ...({
              entity: dialogMode === "create"
                ? createEntity(searchInput)
                : selectedEntity,
              mode: dialogMode,
              service: apiService,
              onSuccess: (data: T) =>
              {
                dispatch(entityActions.refresh({ data }));
                onValueChange(data);
                setOpenDialog(false);
              },
              ...(changeDialogProps ?? {})
            } as BaseDialogProps<T> & TDialogProps) }
          />
        </Dialog>
      ) }
    </div>
  );
}
