import * as XLSX from "xlsx";


export interface ExcelColumn<T>
{
	header: string;
	accessor: (row: T) => string | number | null | undefined;
	width?: number;
}

export function exportToExcel<T>(rows: T[], columns: ExcelColumn<T>[], fileName: string, sheetName = "Sheet1")
{
	const data = rows.map((row) =>
	{
		const record: Record<string, string | number | null | undefined> = {};
		columns.forEach((col) =>
		{
			record[col.header] = col.accessor(row);
		});
		return record;
	});

	const worksheet = XLSX.utils.json_to_sheet(data);

	worksheet["!cols"] = columns.map((col) => ({wch: col.width ?? 15}));

	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

	XLSX.writeFile(workbook, `${ fileName }.xlsx`);
}