import type { BaseReportRequest } from "../../../core/data/report/baseReportRequest.ts";


export class SalesInvoiceReportRequest implements BaseReportRequest
{
	public invoiceId: number;

	constructor(init?: Partial<SalesInvoiceReportRequest>)
	{
		this.invoiceId = 0;
		Object.assign(this, init);
	}
}

export class PurchaseInvoiceReportRequest implements BaseReportRequest
{
	public purchaseInvoiceId: number;

	constructor(init?: Partial<PurchaseInvoiceReportRequest>)
	{
		this.purchaseInvoiceId = 0;
		Object.assign(this, init);
	}
}

export class QuotationReportRequest implements BaseReportRequest
{
	public quotationId: number;

	constructor(init?: Partial<QuotationReportRequest>)
	{
		this.quotationId = 0;
		Object.assign(this, init);
	}
}

export class InvoiceReportRequest extends SalesInvoiceReportRequest
{
}