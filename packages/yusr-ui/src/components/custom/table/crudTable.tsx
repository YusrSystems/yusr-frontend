import type { IEntityState } from "../../../state/interfaces/iEntityState";
import { Table } from "../../pure/table";
import { CrudEmptyTablePreview } from "./crudEmptyTablePreview";

export function CrudTable({ state, children }: { state: IEntityState<any>; children: React.ReactNode; })
{
  if (state.isLoading)
  {
    return <CrudEmptyTablePreview mode="loading" />;
  }

  if (state.entities?.count == 0)
  {
    return <CrudEmptyTablePreview mode="empty" />;
  }

  if (state.entities == undefined)
  {
    return <CrudEmptyTablePreview mode="loading" />;
  }

  return <Table>{ children }</Table>;
}
