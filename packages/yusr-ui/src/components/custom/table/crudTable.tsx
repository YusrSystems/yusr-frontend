import React, { type PropsWithChildren } from "react";
import { Table } from "../../pure/table";
import { CrudEmptyTablePreview } from "./crudEmptyTablePreview";


export type CrudTableProps = {
	loadingState: "loading" | "empty" | "error" | "loaded";
	children?: React.ReactNode;
};

export function CrudTable({loadingState, children}: CrudTableProps & PropsWithChildren)
{
	if (loadingState !== "loaded")
	{
		return <CrudEmptyTablePreview mode={ loadingState }/>;
	}
	return <Table>{ children }</Table>;
}