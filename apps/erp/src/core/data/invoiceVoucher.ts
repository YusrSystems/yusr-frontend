import {ChangeableEntity, Dto} from "yusr-ui";
import {InvoiceRelationType} from "@/core/data/invoiceOld.ts";
import type {Signal} from "@preact/signals-react";

export class InvoiceVoucherDto extends Dto {
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

export class InvoiceVoucher extends ChangeableEntity<InvoiceVoucherDto> {
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

    constructor(dto: Partial<InvoiceVoucherDto> | undefined) {
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
}