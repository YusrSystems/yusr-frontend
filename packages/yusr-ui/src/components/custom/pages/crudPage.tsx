import type { ActionCreatorWithPayload, AsyncThunk, UnknownAction } from "@reduxjs/toolkit";
import type { JSX, PropsWithChildren } from "react";
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
import { DeleteDialog } from "../dialogs/deleteDialog";
import { SearchInput } from "../inputs/searchInput";
import { CrudTable, CrudTableOld, type CrudTableProps } from "../table/crudTable";
import { CrudTableBodyRow, type TableBodyRowInfo } from "../table/crudTableBodyRow";
import { type CardProps, CrudTableCard } from "../table/crudTableCard";
import { CrudTableHeader, type CrudTableHeaderProps } from "../table/crudTableHeader";
import { CrudTableHeaderRows, type CrudTableHeadRow } from "../table/crudTableHeaderRows";
import { CrudTablePagination } from "../table/crudTablePagination";
import { CrudTableRowActionsMenu } from "../table/crudTableRowActionsMenu";
import { UnauthorizedPage } from "../unauthorized/unauthorizedPage";
import useCrudPageRoute from "./useCrudPageRoute";
import type { Dto, Entity } from "../../..//stateManager";

export interface CrudActions<T extends BaseEntity> {
  filter: AsyncThunk<ApiFilterResult<T> | undefined, string | undefined, object>;
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

export function CrudPage2<T extends BaseEntity>(
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
  }: CrudPageProps<T>
) {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { selectedRow, isChangeDialogOpen, isDeleteDialogOpen } = useSlice();
  const { handleOpenChangeDialog, handleSetIsChangeDialogOpen } = useCrudPageRoute<T>({
    actions,
    routeIdParam,
    basePath,
    onRouteOpen
  });

  useEffect(() => {
    if (hasPagePermission) {
      dispatch(actions.filter(undefined) as any);
    }
  }, [dispatch, actions.filter]);

  if (!hasPagePermission) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="px-5 py-3 h-[calc(100vh-50px)] flex flex-col">
      <CrudTableHeader
        title={title}
        addButtonTitle={addNewItemTitle}
        isAddButtonVisible={permissions.addPermission}
        actionButtons={actionButtons}
        changeDialog={ChangeDialog}
      />

      <CrudTableCard cards={cards} />

      <SearchInput
        onSearch={(searchText) => {
          dispatch(actions.setCurrentPage(1));
          onSearchTextChange?.(searchText);
          dispatch(actions.filter(searchText) as any);
        }}
      />

      <div className="rounded-b-xl border shadow-sm overflow-auto flex-1">
        <CrudTableOld state={entityState}>
          <CrudTableHeaderRows tableHeadRows={tableHeadRows} />

          <TableBody>
            {entityState.entities?.data?.map((entity: T, i: number) => (
              <CrudTableBodyRow
                key={i}
                tableRows={tableRowMapper(entity)}
                onDoubleClick={permissions.updatePermission ? () => handleOpenChangeDialog(entity) : undefined}
                dropdownMenu={
                  <CrudTableRowActionsMenu
                    permissions={perRowPermissions ? perRowPermissions(entity) : permissions}
                    type="dropdown"
                    onEditClicked={() => handleOpenChangeDialog(entity)}
                    onDeleteClicked={() => dispatch(actions.openDeleteDialog(entity))}
                    dorpdownItems={dorpdownItems?.(entity)}
                    contextMenuItems={contextMenuItems?.(entity)}
                  />
                }
                contextMenuContent={
                  <CrudTableRowActionsMenu
                    permissions={perRowPermissions ? perRowPermissions(entity) : permissions}
                    type="context"
                    onEditClicked={() => handleOpenChangeDialog(entity)}
                    onDeleteClicked={() => dispatch(actions.openDeleteDialog(entity))}
                    dorpdownItems={dorpdownItems?.(entity)}
                    contextMenuItems={contextMenuItems?.(entity)}
                  />
                }
              />
            ))}
          </TableBody>
        </CrudTableOld>

        <CrudTablePagination
          pageSize={entityState.rowsPerPage}
          totalNumber={entityState.entities?.count ?? 0}
          currentPage={entityState.currentPage || 1}
          onPageChanged={(newPage) => {
            dispatch(actions.setCurrentPage(newPage));
            dispatch(actions.filter() as any);
          }}
        />

        {isChangeDialogOpen && permissions.updatePermission && (
          <Dialog
            open={isChangeDialogOpen}
            onOpenChange={handleSetIsChangeDialogOpen}
          >
            {ChangeDialog}
          </Dialog>
        )}

        {isDeleteDialogOpen && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => dispatch(actions.setIsDeleteDialogOpen(open))}
          >
            <DialogContent dir={i18n.dir()} className="sm:max-w-sm">
              <DeleteDialog
                entityName={entityName}
                id={selectedRow?.id ?? 0}
                service={service}
                onSuccess={() => {
                  dispatch(actions.refresh({ deletedId: selectedRow?.id }));
                  dispatch(actions.setIsDeleteDialogOpen(false));
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {children}
      </div>
    </div>
  );
}


// TODO: make crud page only takes the entity 
// only entity, the permissions must be taken from global state or local storage 
// and the actions must be optional, the user can subscribe to the actions throw the CrudePage itself not it's components
// the components must take the *minimum* required props only
// by: Ahmed Bakri, 01:07 AM (01/06/2026)  
export function CrudPage({ children }: PropsWithChildren) {
  return <div className="px-5 py-3 h-[calc(100vh-50px)] flex flex-col">
    {children}
  </div>
}


CrudPage.Header = function ({ ...props }: CrudTableHeaderProps) {
  return <CrudTableHeader {...props} />
}

CrudPage.Cards = function ({ ...props }: { cards: CardProps[] }) {
  return <CrudTableCard {...props} />
}




// TODO : it could be more separated ( Comound Component )
/* note: we could take permissions from global stored user state instead */


export type CrudPageTableProps<TEntity extends Entity<TDto>, TDto extends Dto> = {
  tableHeadRows: CrudTableHeadRow[];
  entities: TEntity[];
  tableRowMapper: (entity: TEntity) => TableBodyRowInfo[];
  permissions: ResourcePermissions;
  perRowPermissions?: (entity: TEntity) => ResourcePermissions;
  dorpdownItems?: (entity: TEntity) => JSX.Element[];
  contextMenuItems?: (entity: TEntity) => JSX.Element[];
  onDoubleClick?: (entity: TEntity) => void
  onEditClicked?: (entity: TEntity) => void
  onDeleteClicked?: (entity: TEntity) => void
}
CrudPage.Table = function <TEntity extends Entity<TDto>, TDto extends Dto>({
  loadingState,
  tableHeadRows,
  entities,
  tableRowMapper,
  permissions,
  perRowPermissions,
  dorpdownItems,
  contextMenuItems,
  onDeleteClicked,
  onEditClicked,
  onDoubleClick,
  ...props }:
  CrudTableProps & CrudPageTableProps<TEntity, TDto>) {


  return <div className="rounded-b-xl border shadow-sm overflow-auto flex-1">
    <CrudTable loadingState={loadingState} {...props} >

      <CrudTableHeaderRows tableHeadRows={tableHeadRows} />

      <TableBody>
        {entities?.map((entity: TEntity, i: number) => (
          <CrudTableBodyRow
            key={i}
            tableRows={tableRowMapper(entity)}
            onDoubleClick={onDoubleClick ? () => onDoubleClick(entity) : undefined}

            dropdownMenu={
              <CrudTableRowActionsMenu
                permissions={perRowPermissions ? perRowPermissions(entity) : permissions}
                type="dropdown"
                // if not edit clicked then onEditClicked will be undefined
                onEditClicked={onEditClicked ? () => onEditClicked(entity) : () => { }}
                onDeleteClicked={onDeleteClicked ? () => onDeleteClicked(entity) : () => { }}
                dorpdownItems={dorpdownItems?.(entity)}
                contextMenuItems={contextMenuItems?.(entity)}
              />
            }
            contextMenuContent={
              <CrudTableRowActionsMenu
                permissions={perRowPermissions ? perRowPermissions(entity) : permissions}
                type="context"
                onEditClicked={onEditClicked ? () => onEditClicked(entity) : () => { }}
                onDeleteClicked={onDeleteClicked ? () => onDeleteClicked(entity) : () => { }}
                dorpdownItems={dorpdownItems?.(entity)}
                contextMenuItems={contextMenuItems?.(entity)}
              />
            }
          />
        ))}
      </TableBody>
    </CrudTable>
  </div >
}