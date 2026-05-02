// IMPORTANT!!
// Still under development !!!

import type { ActionCreatorWithPayload, AsyncThunk, UnknownAction } from "@reduxjs/toolkit";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { BaseApiService, BaseEntity, ColumnName, FilterCondition, FilterResult, ResourcePermissions } from "yusr-core";
import type { IDialogState } from "../../../state/interfaces/iDialogState";
import type { IEntityState } from "../../../state/interfaces/iEntityState";
import { Dialog, DialogContent } from "../../pure/dialog";
import { TableBody } from "../../pure/table";
import { DeleteDialog } from "../dialogs/deleteDialog";
import { SearchInput } from "../inputs/searchInput";
import { CrudTable } from "../table/crudTable";
import { CrudTableBodyRow } from "../table/crudTableBodyRow";
import { type CardProps, CrudTableCard } from "../table/crudTableCard";
import { CrudTableHeader } from "../table/crudTableHeader";
import { CrudTableHeaderRows, type CrudTableHeadRow } from "../table/crudTableHeaderRows";
import { CrudTablePagination } from "../table/crudTablePagination";
import { CrudTableRowActionsMenu } from "../table/crudTableRowActionsMenu";
import { UnauthorizedPage } from "../unauthorized/unauthorizedPage";
import { CrudPageContext, useCrudPageContext } from "./crudPageContext";
import useCrudPageRoute from "./useCrudPageRoute";

export interface YusrCrudActions<T extends BaseEntity>
{
  filter: AsyncThunk<FilterResult<T> | undefined, FilterCondition | undefined, object>;
  openChangeDialog: (entity: T) => UnknownAction;
  openDeleteDialog: (entity: T) => UnknownAction;
  setIsChangeDialogOpen: (open: boolean) => UnknownAction;
  setIsDeleteDialogOpen: (open: boolean) => UnknownAction;
  refresh: ActionCreatorWithPayload<{ newData?: T; deletedId?: number; }>;
  setCurrentPage: (page: number) => UnknownAction;
}

export type YusrCrudPageProps<T extends BaseEntity> = PropsWithChildren & {
  actions: YusrCrudActions<T>;
  permissions: ResourcePermissions;
  hasPagePermission?: boolean;
  basePath?: string;
  routeIdParam?: string;
  onRouteOpen?: (id: number) => void;
};

export function YusrCrudPage<T extends BaseEntity>(
  {
    actions,
    permissions,
    hasPagePermission = true,
    basePath,
    routeIdParam,
    onRouteOpen,
    children
  }: YusrCrudPageProps<T>
)
{
  const dispatch = useDispatch();
  const { handleOpenChangeDialog, handleSetIsChangeDialogOpen } = useCrudPageRoute<T>({
    actions,
    routeIdParam,
    basePath,
    onRouteOpen
  });

  useEffect(() =>
  {
    if (hasPagePermission)
    {
      dispatch(actions.filter(undefined) as any);
    }
  }, [dispatch, actions.filter]);

  if (!hasPagePermission)
  {
    return <UnauthorizedPage />;
  }

  return (
    <CrudPageContext.Provider
      value={ {
        actions,
        dispatch,
        permissions,
        handleOpenChangeDialog: handleOpenChangeDialog as (entity: BaseEntity) => void,
        handleSetIsChangeDialogOpen
      } }
    >
      <div className="px-5 py-3">
        { children }
      </div>
    </CrudPageContext.Provider>
  );
}

YusrCrudPage.Header = function(
  { title, addNewItemTitle, actionButtons = [], ChangeDialog }: {
    title: string;
    addNewItemTitle: string;
    actionButtons?: React.ReactNode[];
    ChangeDialog: React.ReactNode;
  }
)
{
  const { permissions } = useCrudPageContext();
  return (
    <CrudTableHeader
      title={ title }
      buttonTitle={ addNewItemTitle }
      isButtonVisible={ permissions.addPermission }
      actionButtons={ actionButtons }
      createComp={ ChangeDialog }
    />
  );
};

YusrCrudPage.Cards = function({ cards }: { cards: CardProps[]; })
{
  return <CrudTableCard cards={ cards } />;
};

YusrCrudPage.Search = function<T extends BaseEntity>(
  { columnsToFilter, onConditionChange }: {
    columnsToFilter: ColumnName<T>[];
    onConditionChange?: (condition: FilterCondition | undefined) => void;
  }
)
{
  const { actions, dispatch } = useCrudPageContext();
  return (
    <SearchInput<T>
      columnsNames={ columnsToFilter }
      onSearch={ (condition) =>
      {
        onConditionChange?.(condition);
        dispatch(actions.filter(condition) as any);
      } }
    />
  );
};

YusrCrudPage.Table = function<T extends BaseEntity>(
  { entityState, tableHeadRows, tableRowMapper, dorpdownItems, contextMenuItems }: {
    entityState: IEntityState<T>;
    tableRowMapper: (entity: T) => any[];
    dorpdownItems?: (entity: T) => React.ReactNode[];
    contextMenuItems?: (entity: T) => React.ReactNode[];
    tableHeadRows: CrudTableHeadRow[];
  }
)
{
  const {
    actions,
    permissions,
    handleOpenChangeDialog,
    dispatch
  } = useCrudPageContext<T>();
  return (
    <div className="rounded-b-xl border shadow-sm overflow-hidden">
      <CrudTable state={ entityState }>
        <CrudTableHeaderRows tableHeadRows={ tableHeadRows } />

        <TableBody>
          { entityState.entities?.data?.map((entity: T, i: number) => (
            <CrudTableBodyRow
              key={ i }
              tableRows={ tableRowMapper(entity) }
              dropdownMenu={ 
                <CrudTableRowActionsMenu
                  permissions={ permissions }
                  type="dropdown"
                  onEditClicked={ () => handleOpenChangeDialog(entity) }
                  onDeleteClicked={ () => dispatch(actions.openDeleteDialog(entity)) }
                  dorpdownItems={ dorpdownItems?.(entity) }
                  contextMenuItems={ contextMenuItems?.(entity) }
                />
               }
              contextMenuContent={ 
                <CrudTableRowActionsMenu
                  permissions={ permissions }
                  type="context"
                  onEditClicked={ () => handleOpenChangeDialog(entity) }
                  onDeleteClicked={ () => dispatch(actions.openDeleteDialog(entity)) }
                  dorpdownItems={ dorpdownItems?.(entity) }
                  contextMenuItems={ contextMenuItems?.(entity) }
                />
               }
            />
          )) }
        </TableBody>
      </CrudTable>

      <CrudTablePagination
        pageSize={ entityState.rowsPerPage }
        totalNumber={ entityState.entities?.count ?? 0 }
        currentPage={ entityState.currentPage || 1 }
        onPageChanged={ (newPage) => dispatch(actions.setCurrentPage(newPage)) }
      />
    </div>
  );
};

YusrCrudPage.Dialogs = function<T extends BaseEntity>(
  { ChangeDialog, useSlice, service, entityName }: {
    ChangeDialog: React.ReactNode;
    useSlice: () => IDialogState<T>;
    service: BaseApiService<T>;
    entityName: string;
  }
)
{
  const { selectedRow, isChangeDialogOpen, isDeleteDialogOpen } = useSlice();

  const { actions, dispatch, permissions, handleSetIsChangeDialogOpen } = useCrudPageContext<T>();
  return (
    <>
      { isChangeDialogOpen && permissions.updatePermission && (
        <Dialog
          open={ isChangeDialogOpen }
          onOpenChange={ handleSetIsChangeDialogOpen }
        >
          { ChangeDialog }
        </Dialog>
      ) }

      { isDeleteDialogOpen && permissions.deletePermission && (
        <Dialog
          open={ isDeleteDialogOpen }
          onOpenChange={ (open) => dispatch(actions.setIsDeleteDialogOpen(open)) }
        >
          <DialogContent dir="rtl" className="sm:max-w-sm">
            <DeleteDialog
              entityName={ entityName }
              id={ selectedRow?.id ?? 0 }
              service={ service }
              onSuccess={ () =>
              {
                dispatch(actions.refresh({ deletedId: selectedRow?.id }));
                dispatch(actions.setIsDeleteDialogOpen(false));
              } }
            />
          </DialogContent>
        </Dialog>
      ) }
    </>
  );
};
