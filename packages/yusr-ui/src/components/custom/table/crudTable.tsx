import type { PropsWithChildren } from "react";
import type { IEntityState } from "../../../state/interfaces/iEntityState";
import { Table } from "../../pure/table";
import { CrudEmptyTablePreview } from "./crudEmptyTablePreview";

export function CrudTableOld({ state, children }: { state: IEntityState<any>; children: React.ReactNode; }) {
  if (state.isLoading) {
    return <CrudEmptyTablePreview mode="loading" />;
  }

  if (state.entities?.count == 0) {
    return <CrudEmptyTablePreview mode="empty" />;
  }

  if (state.entities == undefined) {
    return <CrudEmptyTablePreview mode="loading" />;
  }

  return <Table>{children}</Table>;
}

export type CrudTableProps = {
  loadingState: "loading" | "empty" | "error" | 'loaded';
  children?: React.ReactNode;
};

export function CrudTable({ loadingState, children }: CrudTableProps & PropsWithChildren) {
  if (loadingState !== 'loaded') {
    return <CrudEmptyTablePreview mode={loadingState} />;
  }
  return <Table>{children}</Table>;
}