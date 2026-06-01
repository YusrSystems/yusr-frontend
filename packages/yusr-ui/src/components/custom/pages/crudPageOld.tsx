import type { ActionCreatorWithPayload, AsyncThunk, UnknownAction } from "@reduxjs/toolkit";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { ResourcePermissions } from "../../../auth";
import type { BaseEntity } from "../../../entities";
import type { BaseApiServiceOld } from "../../../networking";
import type { IDialogState } from "../../../state/interfaces/iDialogState";
import type { IEntityState } from "../../../state/interfaces/iEntityState";
import type { ApiFilterResult } from "../../../types";
import { Dialog, DialogContent } from "../../pure/dialog";
import { TableBody } from "../../pure/table";
import { DeleteDialogOld } from "../dialogs/deleteDialogOld";
import { SearchInput } from "../inputs/searchInput";
import { CrudTableOld } from "../table/crudTable";
import { CrudTableBodyRow, type TableBodyRowInfo } from "../table/crudTableBodyRow";
import { type CardProps, CrudTableCardOld } from "../table/crudTableCardOld";
import { CrudTableHeaderOld } from "../table/crudTableHeaderOld";
import { CrudTableHeaderRows, type CrudTableHeadRow } from "../table/crudTableHeaderRows";
import { CrudTablePagination } from "../table/crudTablePagination";
import { CrudTableRowActionsMenuOld } from "../table/crudTableRowActionsMenuOld";
import { UnauthorizedPage } from "../unauthorized/unauthorizedPage";
import useCrudPageRoute from "./useCrudPageRoute";

export interface CrudActionsOld<T extends BaseEntity>
{
  filter: AsyncThunk<ApiFilterResult<T> | undefined, string | undefined, object>;
  openChangeDialog: (entity: T) => UnknownAction;
  openDeleteDialog: (entity: T) => UnknownAction;
  setIsChangeDialogOpen: (open: boolean) => UnknownAction;
  setIsDeleteDialogOpen: (open: boolean) => UnknownAction;
  refresh: ActionCreatorWithPayload<{ newData?: T; deletedId?: number; }>;
  setCurrentPage: (page: number) => UnknownAction;
}

export type CrudPagePropsOld<T extends BaseEntity> = PropsWithChildren & {
  entityState: IEntityState<T>;
  useSlice: () => IDialogState<T>;
  actions: CrudActionsOld<T>;
  permissions: ResourcePermissions;
  perRowPermissions?: (entity: T) => ResourcePermissions;
  hasPagePermission?: boolean;
  entityName: string;
  title: string;
  addNewItemTitle: string;
  onSearchTextChange?: (searchText?: string) => void;
  actionButtons?: React.ReactNode[];
  cards: CardProps[];
  service: BaseApiServiceOld<T>;
  tableHeadRows: CrudTableHeadRow[];
  tableRowMapper: (entity: T) => TableBodyRowInfo[];
  ChangeDialog: React.ReactNode;
  dorpdownItems?: (entity: T) => React.ReactNode[];
  contextMenuItems?: (entity: T) => React.ReactNode[];
  basePath?: string;
  routeIdParam?: string;
  onRouteOpen?: (id: number) => void;
};

export function CrudPageOld<T extends BaseEntity>(
  {
    permissions,
    perRowPermissions,
    hasPagePermission = true,
    useSlice,
    entityName,
    title,
    addNewItemTitle,
    onSearchTextChange,
    actionButtons = [],
    cards,
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
  }: CrudPagePropsOld<T>
)
{
  const { i18n } = useTranslation();
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
    <div className="px-5 py-3 h-[calc(100vh-70px)] flex flex-col">
      <CrudTableHeaderOld
        title={ title }
        addButtonTitle={ addNewItemTitle }
        isAddButtonVisible={ permissions.addPermission }
        actionButtons={ actionButtons }
        changeDialog={ ChangeDialog }
      />

      <CrudTableCardOld cards={ cards } />

      <SearchInput
        onSearch={ (searchText) =>
        {
          dispatch(actions.setCurrentPage(1));
          onSearchTextChange?.(searchText);
          dispatch(actions.filter(searchText) as any);
        } }
      />

      <div className="rounded-b-xl border shadow-sm overflow-auto">
        <CrudTableOld state={ entityState }>
          <CrudTableHeaderRows tableHeadRows={ tableHeadRows } />

          <TableBody>
            { entityState.entities?.data?.map((entity: T, i: number) => (
              <CrudTableBodyRow
                key={ i }
                tableRows={ tableRowMapper(entity) }
                onDoubleClick={ permissions.updatePermission ? () => handleOpenChangeDialog(entity) : undefined }
                dropdownMenu={ 
                  <CrudTableRowActionsMenuOld
                    permissions={ perRowPermissions ? perRowPermissions(entity) : permissions }
                    type="dropdown"
                    onEditClicked={ () => handleOpenChangeDialog(entity) }
                    onDeleteClicked={ () => dispatch(actions.openDeleteDialog(entity)) }
                    dorpdownItems={ dorpdownItems?.(entity) }
                    contextMenuItems={ contextMenuItems?.(entity) }
                  />
                 }
                contextMenuContent={ 
                  <CrudTableRowActionsMenuOld
                    permissions={ perRowPermissions ? perRowPermissions(entity) : permissions }
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
        </CrudTableOld>

        <CrudTablePagination
          pageSize={ entityState.rowsPerPage }
          totalNumber={ entityState.entities?.count ?? 0 }
          currentPage={ entityState.currentPage || 1 }
          onPageChanged={ (newPage) =>
          {
            dispatch(actions.setCurrentPage(newPage));
            dispatch(actions.filter() as any);
          } }
        />

        { isChangeDialogOpen && permissions.updatePermission && (
          <Dialog
            open={ isChangeDialogOpen }
            onOpenChange={ handleSetIsChangeDialogOpen }
          >
            { ChangeDialog }
          </Dialog>
        ) }

        { isDeleteDialogOpen && (
          <Dialog
            open={ isDeleteDialogOpen }
            onOpenChange={ (open) => dispatch(actions.setIsDeleteDialogOpen(open)) }
          >
            <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
              <DeleteDialogOld
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
