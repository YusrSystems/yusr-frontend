import type { ActionCreatorWithPayload, AsyncThunk } from "@reduxjs/toolkit";
import { Edit, PlusCircle } from "lucide-react";
import React from "react";
import { BaseApiService, BaseEntity, type ColumnName, FilterCondition, type FilterResult, ResultStatus, SystemPermissions } from "yusr-core";
import { SystemPermissionsActions } from "../../../../../../apps/erp/src/core/auth/systemPermissionsActions";
import { useAppDispatch, useAppSelector } from "../../../../../../apps/erp/src/core/state/store";
import type { IEntityState } from "../../../state";
import { Button, Dialog } from "../../pure";
import type { DialogMode } from "../dialogs/dialogType";
import { SearchableSelect } from "./searchableSelect";

export type ChangableSearchableSelectParams<T extends BaseEntity> = {
  mode?: "dialog" | "inline";
  id?: number;
  itemLabelKey: keyof T;
  itemValueKey: keyof T;
  state: IEntityState<T>;
  apiService: BaseApiService<T>;
  columnsNames: ColumnName[];
  disabled?: boolean;
  isInvalid?: boolean;
  systemPermissionsResources: string;
  allowAdd?: boolean;
  allowUpdate?: boolean;
  onValueChange: (value: T) => void;
  entityActions: {
    filter: AsyncThunk<FilterResult<T> | undefined, FilterCondition | undefined, object>;
    refresh: ActionCreatorWithPayload<{ data?: T; deletedId?: number; }>;
  };
  createEntity: (typedValue: string) => T;
  changeDialog: React.ComponentType<{
    entity?: T;
    mode: DialogMode;
    service: BaseApiService<T>;
    onSuccess: (data: T) => void;
  }>;
};

export default function ChangableSearchableSelect<T extends BaseEntity>(
  {
    mode = "dialog",
    id,
    itemLabelKey,
    itemValueKey,
    state,
    apiService,
    columnsNames,
    disabled,
    isInvalid,
    systemPermissionsResources,
    allowAdd = true,
    allowUpdate = true,
    onValueChange,
    entityActions,
    createEntity,
    changeDialog
  }: ChangableSearchableSelectParams<T>
)
{
  const authState = useAppSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<DialogMode>("create");
  const [selected, setSelected] = React.useState<T | undefined>(
    state.entities?.data?.find(
      (t: T) => t.id === id
    )
  );
  const [typedValue, setTypedValue] = React.useState("");
  const dispatch = useAppDispatch();

  const ChangeDialog = changeDialog;

  const showAddButton = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    systemPermissionsResources,
    SystemPermissionsActions.Add
  ) && allowAdd;

  const showUpdateButton = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    systemPermissionsResources,
    SystemPermissionsActions.Update
  ) && allowUpdate;

  return (
    <div className="flex w-full">
      <div className="flex-9">
        <SearchableSelect
          items={ state.entities?.data || [] }
          itemLabelKey={ itemLabelKey }
          itemValueKey={ itemValueKey }
          value={ id?.toString() || "" }
          columnsNames={ columnsNames }
          buttonClassName={ showAddButton ? "rounded-l-none" : "" }
          onSearch={ (condition) => dispatch(entityActions.filter(condition)) }
          isLoading={ state.isLoading }
          disabled={ state.isLoading || disabled }
          isInvalid={ isInvalid }
          onValueChange={ (val) =>
          {
            const selected = state.entities?.data?.find(
              (t: T) => t.id.toString() === val
            );
            if (selected)
            {
              setSelected(selected);
              onValueChange(selected);
            }
          } }
          onNotFound={ SystemPermissions.hasAuth(
              authState.loggedInUser?.role?.permissions ?? [],
              systemPermissionsResources,
              SystemPermissionsActions.Add
            )
            ? async (typedValue) =>
            {
              if (mode === "inline")
              {
                // create directly, no dialog
                const res = await apiService.Add(createEntity(typedValue));
                if (res.status === ResultStatus.Ok && res.data)
                {
                  dispatch(entityActions.refresh({ data: res.data }));
                  dispatch(entityActions.filter());
                  onValueChange(res.data);
                }
              }
              else
              {
                setTypedValue(typedValue);
                setDialogMode("create");
                dispatch(entityActions.filter());
                setOpenDialog(true);
              }
            }
            : undefined }
          onDelete={ SystemPermissions.hasAuth(
              authState.loggedInUser?.role?.permissions ?? [],
              systemPermissionsResources,
              SystemPermissionsActions.Delete
            )
            ? async (id) =>
            {
              const res = await apiService.Delete(id);
              if (res.status === ResultStatus.Ok)
              {
                dispatch(entityActions.refresh({ deletedId: id }));
                return true;
              }
              return false;
            }
            : undefined }
        />
      </div>

      { showAddButton && (
        <Button
          variant="outline"
          className={ `flex-1 ${selected &&showUpdateButton ? "rounded-none" : "rounded-r-none"}` }
          onClick={ () =>
          {
            setDialogMode("create");
            setTypedValue("");
            setOpenDialog(true);
          } }
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      ) }

      { selected && showUpdateButton && (
        <Button
          variant="secondary"
          className="flex-1 rounded-r-none border-border"
          onClick={ () =>
          {
            setDialogMode("update");
            setOpenDialog(true);
          } }
        >
          <Edit className="h-4 w-4" />
        </Button>
      ) }

      { openDialog
        && (
          <Dialog open={ openDialog } onOpenChange={ setOpenDialog }>
            <ChangeDialog
              entity={ dialogMode === "create"
                ? createEntity(typedValue)
                : selected }
              mode={ dialogMode }
              service={ apiService }
              onSuccess={ (data: T) =>
              {
                dispatch(entityActions.refresh({ data: data }));
                onValueChange(data);
                setSelected(data);
                setOpenDialog(false);
              } }
            />
          </Dialog>
        ) }
    </div>
  );
}
