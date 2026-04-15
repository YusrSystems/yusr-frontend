import { TableHead, TableHeader, TableRow } from "../../pure/table";

export type CrudTableHeadRow = { rowName: string; rowStyles: string; };

export function CrudTableHeaderRows({ tableHeadRows }: { tableHeadRows: CrudTableHeadRow[]; })
{
  return (
    <TableHeader className="bg-muted">
      <TableRow>
        { tableHeadRows.map((row, i) => <TableHead key={ i } className={ row.rowStyles }>{ row.rowName }</TableHead>) }
      </TableRow>
    </TableHeader>
  );
}
