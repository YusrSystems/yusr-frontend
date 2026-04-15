import type { ActionCreatorWithPayload, AsyncThunk, UnknownAction } from "@reduxjs/toolkit";
import type { ResourcePermissions } from "yusr-core";
import type { BaseEntity, FilterCondition } from "yusr-core";
import type { BaseApiService } from "yusr-core";
import type { ColumnName, FilterResult } from "yusr-core";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { IDialogState } from "../../../state/interfaces/iDialogState";
import type { IEntityState } from "../../../state/interfaces/iEntityState";
import { Dialog, DialogContent } from "../../pure/dialog";
import { TableBody } from "../../pure/table";
import { DeleteDialog } from "../dialogs/deleteDialog";
import { SearchInput } from "../inputs/searchInput";
import { CrudTable } from "../table/crudTable";
import { CrudTableBodyRow, type TableBodyRowInfo } from "../table/crudTableBodyRow";
import { CrudTableCard, type CardProps } from "../table/crudTableCard";
import { CrudTableHeader } from "../table/crudTableHeader";
import { CrudTableHeaderRows, type CrudTableHeadRow } from "../table/crudTableHeaderRows";
import { CrudTablePagination } from "../table/crudTablePagination";
import { CrudTableRowActionsMenu } from "../table/crudTableRowActionsMenu";

export interface CrudActions<T extends BaseEntity> {
  filter: AsyncThunk<FilterResult<T> | undefined, FilterCondition | undefined, object>;
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
  entityName: string;
  title: string;
  addNewItemTitle: string;
  cards: CardProps[];
  columnsToFilter: ColumnName[];
  service: BaseApiService<T>;
  tableHeadRows: CrudTableHeadRow[];
  tableRowMapper: (entity: T) => TableBodyRowInfo[];

  ChangeDialog: React.ReactNode;
};

export function CrudPage<T extends BaseEntity>(
  {
    permissions,
    useSlice,
    entityName,
    title,
    addNewItemTitle,
    cards,
    columnsToFilter,
    actions,
    service,
    entityState,
    tableHeadRows,
    tableRowMapper,
    ChangeDialog,
    children
  }: CrudPageProps<T>
) {
  const dispatch = useDispatch();
  const { selectedRow, isChangeDialogOpen, isDeleteDialogOpen } = useSlice();
  useEffect(() => {
    dispatch(actions.filter(undefined) as any);
  }, [dispatch, actions.filter]);

  return (
    <div className="px-5 py-3">
      <CrudTableHeader
        title={title}
        buttonTitle={addNewItemTitle}
        isButtonVisible={permissions.addPermission}
        createComp={ChangeDialog}
      />

      <CrudTableCard cards={cards} />

      <SearchInput columnsNames={columnsToFilter} onSearch={(condition) => dispatch(actions.filter(condition) as any)} />

      <div className="rounded-b-xl border shadow-sm overflow-hidden">
        <CrudTable state={entityState}>
          <CrudTableHeaderRows tableHeadRows={tableHeadRows} />

          <TableBody>
            {entityState.entities?.data?.map((entity: T, i: number) => (
              <CrudTableBodyRow
                key={i}
                tableRows={tableRowMapper(entity)}
                dropdownMenu={
                  <CrudTableRowActionsMenu
                    permissions={permissions}
                    type="dropdown"
                    onEditClicked={() => dispatch(actions.openChangeDialog(entity))}
                    onDeleteClicked={() => dispatch(actions.openDeleteDialog(entity))}
                  />
                }
                contextMenuContent={
                  <CrudTableRowActionsMenu
                    permissions={permissions}
                    type="context"
                    onEditClicked={() => dispatch(actions.openChangeDialog(entity))}
                    onDeleteClicked={() => dispatch(actions.openDeleteDialog(entity))}
                  />
                }
              />
            ))}
          </TableBody>
        </CrudTable>

        <CrudTablePagination
          pageSize={entityState.rowsPerPage}
          totalNumber={entityState.entities?.count ?? 0}
          currentPage={entityState.currentPage || 1}
          onPageChanged={(newPage) => dispatch(actions.setCurrentPage(newPage))}
        />

        {isChangeDialogOpen && permissions.updatePermission && (
          <Dialog
            open={isChangeDialogOpen}
            onOpenChange={(open) => dispatch(actions.setIsChangeDialogOpen(open))}
          >
            {ChangeDialog}
          </Dialog>
        )}

        {isDeleteDialogOpen && permissions.deletePermission && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => dispatch(actions.setIsDeleteDialogOpen(open))}
          >
            <DialogContent dir="rtl" className="sm:max-w-sm">
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
