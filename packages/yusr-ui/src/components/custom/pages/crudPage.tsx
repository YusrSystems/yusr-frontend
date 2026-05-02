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
import { CrudTableBodyRow, type TableBodyRowInfo } from "../table/crudTableBodyRow";
import { type CardProps, CrudTableCard } from "../table/crudTableCard";
import { CrudTableHeader } from "../table/crudTableHeader";
import { CrudTableHeaderRows, type CrudTableHeadRow } from "../table/crudTableHeaderRows";
import { CrudTablePagination } from "../table/crudTablePagination";
import { CrudTableRowActionsMenu } from "../table/crudTableRowActionsMenu";
import { UnauthorizedPage } from "../unauthorized/unauthorizedPage";
import useCrudPageRoute from "./useCrudPageRoute";

export interface CrudActions<T extends BaseEntity>
{
  filter: AsyncThunk<FilterResult<T> | undefined, FilterCondition<T> | undefined, object>;
  openChangeDialog: (entity: T) => UnknownAction;
  openDeleteDialog: (entity: T) => UnknownAction;
  setIsChangeDialogOpen: (open: boolean) => UnknownAction;
  setIsDeleteDialogOpen: (open: boolean) => UnknownAction;
  refresh: ActionCreatorWithPayload<{ newData?: T; deletedId?: number; }>;
  setCurrentPage: (page: number) => UnknownAction;
}

export type CrudPageProps<T extends BaseEntity> = PropsWithChildren & {
  entityState: IEntityState<T>;
  useSlice: () => IDialogState<T>;
  actions: CrudActions<T>;
  permissions: ResourcePermissions;
  hasPagePermission?: boolean;
  entityName: string;
  title: string;
  addNewItemTitle: string;
  onConditionChange?: (condition: FilterCondition<T> | undefined) => void;
  actionButtons?: React.ReactNode[];
  cards: CardProps[];
  columnsToFilter: ColumnName<T>[];
  service: BaseApiService<T>;
  tableHeadRows: CrudTableHeadRow[];
  tableRowMapper: (entity: T) => TableBodyRowInfo[];
  ChangeDialog: React.ReactNode;
  dorpdownItems?: (entity: T) => React.ReactNode[];
  contextMenuItems?: (entity: T) => React.ReactNode[];
  basePath?: string;
  routeIdParam?: string;
  onRouteOpen?: (id: number) => void;
};

export function CrudPage<T extends BaseEntity>(
  {
    permissions,
    hasPagePermission = true,
    useSlice,
    entityName,
    title,
    addNewItemTitle,
    onConditionChange,
    actionButtons = [],
    cards,
    columnsToFilter,
    actions,
    service,
    entityState,
    tableHeadRows,
    tableRowMapper,
    ChangeDialog,
    dorpdownItems,
    contextMenuItems,
    basePath,
    routeIdParam,
    onRouteOpen,
    children
  }: CrudPageProps<T>
)
{
  const dispatch = useDispatch();
  const { selectedRow, isChangeDialogOpen, isDeleteDialogOpen } = useSlice();
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
    <div className="px-5 py-3">
      <CrudTableHeader
        title={ title }
        buttonTitle={ addNewItemTitle }
        isButtonVisible={ permissions.addPermission }
        actionButtons={ actionButtons }
        createComp={ ChangeDialog }
      />

      <CrudTableCard cards={ cards } />

      <SearchInput<T>
        columnsNames={ columnsToFilter }
        onSearch={ (condition) =>
        {
          onConditionChange?.(condition);
          dispatch(actions.filter(condition) as any);
        } }
      />

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

        { children }
      </div>
    </div>
  );
}
