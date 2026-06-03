import { Signal, signal } from "@preact/signals-react";
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

const isChangeDialogOpen = signal<boolean>(false);
const isDeleteDialogOpen = signal<boolean>(false);
const selectedEntity = signal<any | undefined>(undefined);

export type CrudPageTableRow<TEntity extends Entity<TDto>, TDto extends Dto> = {
  data: TEntity[];
  headerRows: { rowBody: ReactNode; rowStyles: string; }[];
  tableRowMapper: (entity: TEntity) => { rowBody: ReactNode; rowStyles?: string; }[];
  onDoubleClick?: (entity: TEntity) => void;
};

export type CrudPageChangeDialogProps = {
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

CrudPage.Header = function({ ...props }: Omit<CrudTableHeaderProps, "onAddButtonClicked">)
{
  useSignals();
  return <CrudTableHeader onAddButtonClicked={ () => isChangeDialogOpen.value = true } { ...props } />;
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
  { data, headerRows, tableRowMapper, ...props }:
    & Omit<CrudPageTableRow<TEntity, TDto>, "onDoubleClick">
    & Omit<CrudTableRowActionsMenuProps, "onEditClicked" | "onDeleteClicked">
)
{
  useSignals();
  const { i18n } = useTranslation();
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
                onDoubleClick={ () =>
                {
                  selectedEntity.value = entity;
                  isChangeDialogOpen.value = true;
                } }
                className="hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <TableCell>
                  <CrudTableRowActionsMenu
                    { ...props }
                    type="dropdown"
                    onEditClicked={ () =>
                    {
                      selectedEntity.value = entity;
                      isChangeDialogOpen.value = true;
                    } }
                    onDeleteClicked={ () =>
                    {
                      selectedEntity.value = entity;
                      isDeleteDialogOpen.value = true;
                    } }
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
              onEditClicked={ () =>
              {
                selectedEntity.value = entity;
                isChangeDialogOpen.value = true;
              } }
              onDeleteClicked={ () =>
              {
                selectedEntity.value = entity;
                isDeleteDialogOpen.value = true;
              } }
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

CrudPage.ChangeDialog = function({ changeDialog }: CrudPageChangeDialogProps)
{
  useSignals();
  return (
    <>
      { isChangeDialogOpen.value && (
        <Dialog
          open={ isChangeDialogOpen.value }
          onOpenChange={ (open) => isChangeDialogOpen.value = open }
        >
          { changeDialog }
        </Dialog>
      ) }
    </>
  );
};

CrudPage.DeleteDialog = function<TEntity extends Entity<TDto>, TDto extends Dto>(
  { entityNameSelector, onSuccess, ...props }:
    & Omit<DeleteDialogProps<TEntity, TDto>, "id" | "entityName" | "onSuccess">
    & {
      entityNameSelector: (entity: TEntity) => Signal<string>;
      onSuccess?: (entity: TEntity) => void;
    }
)
{
  useSignals();
  const { i18n } = useTranslation();

  const entity: TEntity | undefined = selectedEntity.value as TEntity;
  if (entity?.id === undefined)
  {
    return undefined;
  }

  return (
    <Dialog
      open={ isDeleteDialogOpen.value }
      onOpenChange={ (open) => isDeleteDialogOpen.value = open }
    >
      <DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
        <DeleteDialog
          { ...props }
          id={ entity.id.value }
          entityName={ entityNameSelector(entity).value }
          onSuccess={ () =>
          {
            onSuccess?.(entity);
            isDeleteDialogOpen.value = false;
          } }
        />
      </DialogContent>
    </Dialog>
  );
};
