import { ChangeableEntityMode } from "yusr-ui";
import { type Signal } from "@preact/signals-react";
import { InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus";
import { PaymentStatus } from "@/core/types/paymentStatus";
import { ImportExportType } from "@/core/types/importExportType";
import { Voucher, VoucherDto, VoucherType } from "@/core/data/voucher";
import { Services } from "@/core/services/services";
import { CommercialDocument, type ICommercialDocumentDto } from "./commercialDocument";
import type { CommercialItem, ICommercialItemDto } from "./commercialItem";


export class CommercialInvoiceMode
{
	static readonly Normal = new CommercialInvoiceMode("normal");
	static readonly Return = new CommercialInvoiceMode("return");
	static readonly Copy = new CommercialInvoiceMode("copy");

	constructor(public modeName: string)
	{
	}
}

export interface ICommercialInvoiceDocumentDto extends ICommercialDocumentDto
{
	paidAmount: number;
	returnStatusId: InvoiceReturnStatus;
	paymentStatusId: PaymentStatus;
	importExportType: ImportExportType;
	idempotencyKey?: string;
	paymentVouchers: VoucherDto[];
	deleteOriginalInvoiceCostVouchers: boolean;
	invoiceMode?: CommercialInvoiceMode;
}

export abstract class CommercialInvoiceDocument<
	TDto extends ICommercialInvoiceDocumentDto,
	TItem extends CommercialItem<TItemDto, CommercialInvoiceDocument<TDto, TItem, TItemDto>>,
	TItemDto extends ICommercialItemDto
> extends CommercialDocument<TDto, TItem, TItemDto>
{
	public paidAmount: Signal<number>;
	public returnStatusId: Signal<InvoiceReturnStatus>;
	public paymentStatusId: Signal<PaymentStatus>;
	public importExportType: Signal<ImportExportType>;
	public idempotencyKey: Signal<string | undefined>;
	public paymentVouchers: Signal<Voucher[]>;
	public deleteOriginalInvoiceCostVouchers: Signal<boolean>;
	public invoiceMode: Signal<CommercialInvoiceMode>;

	public override get isDisabled(): boolean
	{
		return this.mode.value === ChangeableEntityMode.Update || this.invoiceMode.value === CommercialInvoiceMode.Return;
	}

	protected constructor(
		dto: Partial<TDto> | undefined,
		mode: ChangeableEntityMode = ChangeableEntityMode.Create
	)
	{
		super(dto, mode);
		this.paidAmount = this.assign("paidAmount", dto?.paidAmount ?? 0);
		this.returnStatusId = this.assign("returnStatusId", dto?.returnStatusId ?? InvoiceReturnStatus.NotReturned);
		this.paymentStatusId = this.assign("paymentStatusId", dto?.paymentStatusId ?? PaymentStatus.NotPaid);
		this.importExportType = this.assign("importExportType", dto?.importExportType ?? ImportExportType.Local);
		this.idempotencyKey = this.assign("idempotencyKey", dto?.idempotencyKey ?? crypto.randomUUID());
		this.deleteOriginalInvoiceCostVouchers = this.assign(
			"deleteOriginalInvoiceCostVouchers",
			dto?.deleteOriginalInvoiceCostVouchers ?? false
		);
		this.invoiceMode = this.assign("invoiceMode", dto?.invoiceMode ?? CommercialInvoiceMode.Normal);

		this.paymentVouchers = this.assign(
			"paymentVouchers",
			(dto?.paymentVouchers ?? []).map((x) =>
				mode === ChangeableEntityMode.Update ? Voucher.load(x) : Voucher.create(x)
			)
		);

		this.paymentVouchers.value.forEach((v) =>
			v.hasChanges.subscribe(() =>
			{
				this.hasChanges.value =
					this.paymentVouchers.value.some((t) => t.hasChanges.value) ||
					this.items.value.some((t) => t.hasChanges.value);
			})
		);
	}

	public override syncTotals(): void
	{
		super.syncTotals();
		this.syncPaymentVouchers();
	}

	public resetPaymentVouchers()
	{
		this.paymentVouchers.value = [];
	}

	public createInitialPaymentVoucher(amount: number): Voucher
	{
		const voucher = Voucher.create({
			paymentMethodId: Services.auth.setting?.mainPaymentMethodId?.value,
			paymentMethodName: Services.auth.setting?.mainPaymentMethodName?.value,
			partnerId: this.partnerId.value,
			partnerName: this.partnerName.value,
			type: this.getInitialVoucherType(),
			amount
		});
		this.assignVoucherDocumentId(voucher);
		return voucher;
	}

	public updatePaidAmount()
	{
		this.paidAmount.value = this.paymentVouchers.value.reduce((sum, v) => sum + (v.amount.value ?? 0), 0);
	}

	public syncPaymentVouchers()
	{
		if (this.mode.value === ChangeableEntityMode.Update) return;
		this.syncTotals();
		const taxInclusivePrice = this.fullAmount.value;
		const vouchers = this.paymentVouchers.value;

		if (taxInclusivePrice === 0)
		{
			this.resetPaymentVouchers();
		}
		else if (vouchers.length === 0)
		{
			this.paymentVouchers.value = [this.createInitialPaymentVoucher(taxInclusivePrice)];
		}
		else if (vouchers.length === 1 && vouchers[0])
		{
			const voucher = vouchers[0];
			voucher.amount.value = taxInclusivePrice;
			if (!voucher.partnerId.value)
			{
				voucher.partnerId.value = this.partnerId.value;
				voucher.partnerName.value = this.partnerName.value;
			}
		}
		this.paidAmount.value = taxInclusivePrice;
	}

	override validate(dto?: Partial<TDto>): boolean
	{
		const baseValid = super.validate(dto);
		const paymentsValid = this.paymentVouchers.value.every((v) => v.validate());
		return baseValid && paymentsValid;
	}

	protected abstract getInitialVoucherType(): VoucherType;

	protected abstract assignVoucherDocumentId(voucher: Voucher): void;
}