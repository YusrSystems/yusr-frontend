import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import type { PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Dto, Entity } from "../../..//stateManager";
import { ContextMenu, ContextMenuTrigger } from "../../../components/pure";
import { Dialog, DialogContent } from "../../pure/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../pure/table";
import { DeleteDialog, type DeleteDialogProps } from "../dialogs/deleteDialog";
import { SearchInput, type SearchInputParams } from "../inputs/searchInput";
import { CrudTableCard, type CrudTableCardProps } from "../table/crudTableCard";
import { CrudTableHeader, type CrudTableHeaderProps } from "../table/crudTableHeader";
import { CrudTablePagination, type CrudTablePaginationProps } from "../table/crudTablePagination";
import { CrudTableRowActionsMenu, type CrudTableRowActionsMenuProps } from "../table/crudTableRowActionsMenu";

// TODO: make crud page only takes the entity
// only entity, the permissions must be taken from global state or local storage
// and the actions must be optional, the user can subscribe to the actions throw the CrudePage itself not it's components
// the components must take the *minimum* required props only
// by: Ahmed Bakri, 01:07 AM (01/06/2026)

export type CrudPageTableRow<TEntity extends Entity<TDto>, TDto extends Dto> = {
  data: TEntity[];
  headerRows: { rowBody: ReactNode; rowStyles: string; }[];
  tableRowMapper: (entity: TEntity) => { rowBody: ReactNode; rowStyles?: string; }[];
  onDoubleClick?: (entity: TEntity) => void;
};

export type CrudDialogState = {
  open: Signal<boolean>;
  onOpenChange: (open: boolean) => void;
};

export type CrudPageChangeDialogProps = CrudDialogState & {
  changeDialog: React.ReactNode;
};

export function CrudPage({ children }: PropsWithChildren)
{
  useSignals();
  return (
    <div className="px-5 py-3 h-[calc(100vh-70px)] flex flex-col">
      { children }
    </div>
  );
}

CrudPage.Header = function({ ...props }: CrudTableHeaderProps)
{
  useSignals();
  return <CrudTableHeader { ...props } />;
};

CrudPage.Cards = function({ ...props }: CrudTableCardProps)
{
  useSignals();
  return <CrudTableCard { ...props } />;
};

CrudPage.SearchInput = function({ ...props }: SearchInputParams)
{
  return <SearchInput { ...props } />;
};

CrudPage.Table = function({ children }: PropsWithChildren)
{
  useSignals();
  return (
    <>
      <div className="rounded-b-xl border shadow-sm overflow-auto ">
        { children }
      </div>
    </>
  );
};

CrudPage.TableBody = function<TEntity extends Entity<TDto>, TDto extends Dto>(
  { data, headerRows, tableRowMapper, onDoubleClick, ...props }:
    & CrudPageTableRow<TEntity, TDto>
    & CrudTableRowActionsMenuProps
    & CrudTablePaginationProps
)
{
  useSignals();
  const { i18n } = useTranslation();
  console.log("table rendered");
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          { headerRows.map((row, i) => <TableHead key={ i } className={ row.rowStyles }>{ row.rowBody }</TableHead>) }
        </TableRow>
      </TableHeader>

      <TableBody>
        { data.map((entity, i: number) => (
          <ContextMenu dir={ i18n.dir() } key={ i }>
            <ContextMenuTrigger asChild>
              <TableRow
                onDoubleClick={ () => onDoubleClick?.(entity) }
                className="hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <TableCell>
                  <CrudTableRowActionsMenu
                    { ...props }
                    type="dropdown"
                  />
                </TableCell>

                { tableRowMapper(entity).map((row, i) => (
                  <TableCell key={ i }>
                    <div className={ row.rowStyles }>{ row.rowBody }</div>
                  </TableCell>
                )) }
              </TableRow>
            </ContextMenuTrigger>

            <CrudTableRowActionsMenu
              { ...props }
              type="context"
            />
          </ContextMenu>
        )) }
      </TableBody>
    </Table>
  );
};

CrudPage.TablePagination = function(props: CrudTablePaginationProps)
{
  useSignals();
  return <CrudTablePagination { ...props } />;
};

CrudPage.ChangeDialog = function({ changeDialog, open, onOpenChange }: CrudPageChangeDialogProps)
{
  useSignals();
  return (
    <>
      { open.value && ( // ✅ Signal read inside JSX — reactive
        <Dialog open={ open.value } onOpenChange={ onOpenChange }>
          { changeDialog }
        </Dialog>
      ) }
    </>
  );
};

CrudPage.DeleteDialog = function<TEntity extends Entity<TDto>, TDto extends Dto>(
  { open, onOpenChange, ...props }: CrudDialogState & DeleteDialogProps<TEntity, TDto>
)
{
  useSignals();
  const { i18n } = useTranslation();

  return (
    <Dialog
      open={ open.value }
      onOpenChange={ onOpenChange }
    >
      <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
        <DeleteDialog { ...props } />
      </DialogContent>
    </Dialog>
  );
};
