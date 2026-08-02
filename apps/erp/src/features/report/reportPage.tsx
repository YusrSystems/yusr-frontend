import { type PropsWithChildren, useState } from "react";
import { FileSpreadsheet, Loader2, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type ExcelColumn, exportToExcel } from "@/features/report/excel/exportToExcel.ts";
import { Button, SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";
import { Services } from "@/core/services/services.ts";


interface ReportPageProps extends PropsWithChildren
{
	permissionResource?: string;
}

export default function ReportPage({children, permissionResource}: ReportPageProps)
{
	if (permissionResource && !Services.auth.hasAuth(permissionResource, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<div className="flex flex-col h-[calc(100vh-70px)] print:h-auto max-w-5xl w-full mx-auto pb-6 px-4 print:p-0">
			{ children }
		</div>
	);
}

ReportPage.ActionButtonsContainer = function ({children}: PropsWithChildren)
{
	return <div className="flex gap-3 mb-6 justify-end print:hidden">
		{ children }
	</div>;
};

function ReportPagePrintButton()
{
	const {t} = useTranslation("common");

	return (
		<Button
			onClick={ () => window.print() }
			className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2"
		>
			<Printer className="me-1 size-5"/>
			{ t("printReport") }
		</Button>
	);
}

ReportPage.PrintButton = ReportPagePrintButton;

interface ExportExcelButtonProps<T>
{
	getRows: () => Promise<T[]>;
	columns: ExcelColumn<T>[];
	fileName: string;
	label?: string;
}

function ReportPageExcelButton<T>({getRows, columns, fileName, label}: ExportExcelButtonProps<T>)
{
	const {t} = useTranslation("erpCommon");
	const [isExporting, setIsExporting] = useState(false);

	const handleExport = async () =>
	{
		setIsExporting(true);
		try
		{
			const rows = await getRows();
			exportToExcel(rows, columns, fileName);
		}
		finally
		{
			setIsExporting(false);
		}
	};

	return (
		<Button
			variant="outline"
			disabled={ isExporting }
			onClick={ handleExport }
			className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2"
		>
			{ isExporting ? <Loader2 className="me-1 size-5 animate-spin"/> :
				<FileSpreadsheet className="me-1 size-5"/> }
			{ label ?? t("reports.exportToExcel") }
		</Button>
	);
}

ReportPage.ExcelButton = ReportPageExcelButton;