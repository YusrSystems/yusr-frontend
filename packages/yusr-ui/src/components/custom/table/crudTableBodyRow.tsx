import type { ReactNode } from "react";
import { ContextMenu, ContextMenuTrigger } from "../../pure/context-menu";
import { TableCell, TableRow } from "../../pure/table";

export type TableBodyRowInfo = { rowName: ReactNode; rowStyles?: string; };

interface GenericRowProps {
  tableRows: TableBodyRowInfo[];
  dropdownMenu: ReactNode;
  contextMenuContent: ReactNode;
}

export function CrudTableBodyRow({ tableRows, dropdownMenu, contextMenuContent }: GenericRowProps) {
  return (
    <>
      <ContextMenu dir="rtl">
        <ContextMenuTrigger asChild>
          <TableRow className="hover:bg-secondary/50 transition-colors">
            <TableCell>{dropdownMenu}</TableCell>

            {tableRows.map((row, i) => (
              <TableCell key={i}>
                {/* UPDATE: Changed span to div. 
                    Putting block elements (like your custom badges) inside a span throws DOM warnings. */}
                <div className={row.rowStyles}>{row.rowName}</div>
              </TableCell>
            ))}
          </TableRow>
        </ContextMenuTrigger>

        {contextMenuContent}
      </ContextMenu>
    </>
  );
}
