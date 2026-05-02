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

type BaseDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiService<T>;
  onSuccess: (data: T) => void;
};

export type ChangableSearchableSelectParams<T extends BaseEntity, TDialogProps extends object = {}> = {
  mode?: "dialog" | "inline";
  id?: number;
  items?: T[];
  itemLabelKey: keyof T;
  itemValueKey: keyof T;
  state: IEntityState<T>;
  apiService: BaseApiService<T>;
  columnsNames: ColumnName<T>[];
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
  createEntity: (typedCondition: FilterCondition) => T;
  changeDialog: React.ComponentType<BaseDialogProps<T> & TDialogProps>;
  changeDialogProps?: TDialogProps;
};

export default function ChangableSearchableSelect<T extends BaseEntity, TDialogProps extends object = {}>(
  {
    mode = "dialog",
    id,
    items,
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
    changeDialog,
    changeDialogProps
  }: ChangableSearchableSelectParams<T, TDialogProps>
)
{
  const authState = useAppSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<DialogMode>("create");
  const [selected, setSelected] = React.useState<T | undefined>(
    (items ?? state.entities?.data)?.find(
      (t: T) => t.id === id
    )
  );
  const [typedCondition, setTypedCondition] = React.useState<FilterCondition>({
    value: "",
    columnName: columnsNames[0]?.value.toString() || ""
  });
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
          items={ items ?? state.entities?.data ?? [] }
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
            const selected = (items ?? state.entities?.data)?.find(
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
            ? async (con) =>
            {
              if (mode === "inline")
              {
                // create directly, no dialog
                const res = await apiService.Add(createEntity(con));
                if (res.status === ResultStatus.Ok && res.data)
                {
                  dispatch(entityActions.refresh({ data: res.data }));
                  dispatch(entityActions.filter());
                  onValueChange(res.data);
                }
              }
              else
              {
                setTypedCondition(con);
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
          className={ `flex-1 ${selected && showUpdateButton ? "rounded-none" : "rounded-r-none"}` }
          onClick={ () =>
          {
            setDialogMode("create");
            setTypedCondition({ ...typedCondition, value: "" });
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
              { ...({
                entity: dialogMode === "create"
                  ? createEntity(typedCondition)
                  : selected,
                mode: dialogMode,
                service: apiService,
                onSuccess: (data: T) =>
                {
                  dispatch(entityActions.refresh({ data }));
                  onValueChange(data);
                  setSelected(data);
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
