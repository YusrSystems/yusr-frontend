import type { InvoiceReportResult } from "./invoiceReportResult";
import { InvoicePrintSize } from "@/core/data/setting";
import { A4InvoiceReport } from "./a4InvoiceReport";
import { ThermalInvoiceReport } from "./thermalInvoiceReport";


export function InvoiceReport({data, isPortal = true}: { data?: InvoiceReportResult, isPortal?: boolean })
{
	if (!data) return null;

	if (data.invoicePrintSize === InvoicePrintSize.ThermalPrinter)
	{
		return <ThermalInvoiceReport data={ data } isPortal={ isPortal }/>;
	}

	return <A4InvoiceReport data={ data } isPortal={ isPortal }/>;
}