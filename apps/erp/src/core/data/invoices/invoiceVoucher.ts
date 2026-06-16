import type Invoice from "@/core/data/invoices/invoice.ts";
import { Services } from "@/core/services/services.ts";
import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, Dto } from "yusr-ui";
import { InvoiceRelationType } from "@/core/types/invoiceRelationType.ts";


export class InvoiceVoucherDto extends Dto
{
	public invoiceId!: number;
	public voucherId!: number;
	public accountId!: number;
	public accountName!: string;
	public invoiceRelationType!: InvoiceRelationType;
	public paymentMethodId!: number;
	public paymentMethodName!: string;
	public amount!: number;
	public amountReceived?: number;
	public description?: string;
}

export class InvoiceVoucher extends ChangeableEntity<InvoiceVoucherDto>
{
	public invoiceId: Signal<number>;
	public voucherId: Signal<number>;
	public accountId: Signal<number | undefined>;
	public accountName: Signal<string | undefined>;
	public invoiceRelationType: Signal<InvoiceRelationType>;
	public paymentMethodId: Signal<number | undefined>;
	public paymentMethodName: Signal<string | undefined>;
	public amount: Signal<number>;
	public amountReceived: Signal<number | undefined>;
	public description: Signal<string | undefined>;

	constructor(dto: Partial<InvoiceVoucherDto> | undefined)
	{
		super(dto, [], "create");

		this.invoiceId = this.assign("invoiceId", dto?.invoiceId ?? 0);
		this.voucherId = this.assign("voucherId", dto?.voucherId ?? 0);
		this.accountId = this.assign("accountId", dto?.accountId);
		this.accountName = this.assign("accountName", dto?.accountName);
		this.invoiceRelationType = this.assign("invoiceRelationType", dto?.invoiceRelationType ?? InvoiceRelationType.Payment);
		this.paymentMethodId = this.assign("paymentMethodId", dto?.paymentMethodId);
		this.paymentMethodName = this.assign("paymentMethodName", dto?.paymentMethodName);
		this.amount = this.assign("amount", dto?.amount ?? 0);
		this.amountReceived = this.assign("amountReceived", dto?.amountReceived);
		this.description = this.assign("description", dto?.description);
	}

	public static createCostVoucher(invoice: Invoice): InvoiceVoucher
	{
		return InvoiceVoucher.createVoucher(invoice, InvoiceRelationType.Cost);
	}

	public static createPaymentVoucher(invoice: Invoice): InvoiceVoucher
	{
		return InvoiceVoucher.createVoucher(invoice, InvoiceRelationType.Payment);
	}

	private static createVoucher(invoice: Invoice, invoiceRelationType: InvoiceRelationType): InvoiceVoucher
	{
		return InvoiceVoucher.create({
			voucherId: Math.floor(Math.random() * -1000000), // we need to generate fake id, so we can track it and delete it, negative so it never collides with real id
			invoiceId: invoice.id.value ?? 0,
			paymentMethodId: Services?.auth?.setting?.mainPaymentMethodId?.value ?? 0,
			paymentMethodName: Services?.auth?.setting?.mainPaymentMethodName?.value ?? "",
			accountId: invoice.actionAccountId.value ?? 0,
			accountName: invoice.actionAccountName.value ?? "",
			invoiceRelationType: invoiceRelationType,
			amount: 0,
			amountReceived: 0,
			description: undefined
		});
	}
}