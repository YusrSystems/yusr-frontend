import React, { type PropsWithChildren } from "react";
import { Table } from "../../pure/table";
import { CrudEmptyTablePreview } from "#/components/custom";


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