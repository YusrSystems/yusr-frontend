export class SalesInvoiceReportRequest
{
	public invoiceId: number;

	constructor(init?: Partial<SalesInvoiceReportRequest>)
	{
		this.invoiceId = 0;
		Object.assign(this, init);
	}
}

export class PurchaseInvoiceReportRequest
{
	public purchaseInvoiceId: number;

	constructor(init?: Partial<PurchaseInvoiceReportRequest>)
	{
		this.purchaseInvoiceId = 0;
		Object.assign(this, init);
	}
}

export class QuotationReportRequest
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