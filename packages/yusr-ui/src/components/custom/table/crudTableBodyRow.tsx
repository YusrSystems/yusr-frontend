import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuTrigger } from "../../pure/context-menu";
import { TableCell, TableRow } from "../../pure/table";

export type TableBodyRowInfo = { rowName: ReactNode; rowStyles?: string; };

type CrudTableBodyRowProps = {
  tableRows: TableBodyRowInfo[];
  dropdownMenu: ReactNode;
  contextMenuContent: ReactNode;
  onDoubleClick?: () => void;
};

export function CrudTableBodyRow({ tableRows, dropdownMenu, contextMenuContent, onDoubleClick }: CrudTableBodyRowProps)
{
  const { i18n } = useTranslation();
  return (
    <>
      <ContextMenu dir={ i18n.dir() }>
        <ContextMenuTrigger asChild>
          <TableRow
            onDoubleClick={ onDoubleClick }
            className="hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <TableCell>{ dropdownMenu }</TableCell>

            { tableRows.map((row, i) => (
              <TableCell key={ i }>
                <div className={ row.rowStyles }>{ row.rowName }</div>
              </TableCell>
            )) }
          </TableRow>
        </ContextMenuTrigger>

        { contextMenuContent }
      </ContextMenu>
    </>
  );
}
