import {ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators} from "yusr-ui";
import {Signal} from "@preact/signals-react";
import {PaymentMethod, type PaymentMethodDto} from "@/features/paymentMethods/data/paymentMethod.ts";

export const VoucherType = {
    Payment: 1,
    Receipt: 2
} as const;
export type VoucherType = (typeof VoucherType)[keyof typeof VoucherType];

export class VoucherDto extends Dto {
    public type!: VoucherType;
    public date!: string | Date;
    public amount!: number;
    public isAmountDue!: boolean;
    public commissionAmount!: number;
    public accountId!: number;
    public paymentMethodId!: number;
    public description?: string;
    public invoiceId?: number;
    public giver?: string;
    public recipient?: string;

    public accountName?: string;
    public paymentMethod?: PaymentMethodDto


    ;
}

export class Voucher extends ChangeableEntity<VoucherDto> {
    public type: Signal<VoucherType>;
    public date: Signal<string | Date>;
    public amount: Signal<number>;
    public isAmountDue: Signal<boolean>;
    public commissionAmount: Signal<number>;
    public accountId: Signal<number>;
    public paymentMethodId: Signal<number>;
    public description: Signal<string>;
    public invoiceId: Signal<number>;
    public giver: Signal<string>;
    public recipient: Signal<string>;

    public accountName: Signal<string>;
    public paymentMethod: Signal<PaymentMethod>;

    constructor(dto?: Partial<VoucherDto>, mode: ChangeableEntityMode = "create") {
        super(dto, [{
            field: "type",
            selector: (d) => d.type,
            validators: [Validators.required(i18n.t("accounting:vouchers.typeRequired"))]
        }, {
            field: "date",
            selector: (d) => d.date,
            validators: [Validators.required(i18n.t("accounting:vouchers.dateRequired"))]
        }, {
            field: "amount",
            selector: (d) => d.amount,
            validators: [Validators.required(i18n.t("accounting:vouchers.amountRequired"))]
        }, {
            field: "accountId",
            selector: (d) => d.accountId,
            validators: [Validators.required(i18n.t("accounting:vouchers.accountRequired"))]
        }, {
            field: "paymentMethodId",
            selector: (d) => d.paymentMethodId,
            validators: [Validators.required(i18n.t("accounting:vouchers.paymentMethodRequired"))]
        }], mode);
        console.log(dto?.type)
        this.type = this.assign("type", dto?.type ? dto.type : VoucherType.Payment);
        this.date = this.assign("date", dto?.date ?
            new Date(dto?.date).toLocaleDateString("en-CA")
            : new Date().toLocaleDateString("en-CA"));
        this.amount = this.assign("amount", dto?.amount);
        this.isAmountDue = this.assign("isAmountDue", dto?.amount);
        this.commissionAmount = this.assign("commissionAmount", dto?.commissionAmount);
        this.accountId = this.assign("accountId", dto?.id);
        this.paymentMethodId = this.assign("paymentMethodId", dto?.paymentMethodId);
        this.description = this.assign("description", dto?.description);
        this.invoiceId = this.assign("invoiceId", dto?.invoiceId);
        this.giver = this.assign("giver", dto?.giver);
        this.recipient = this.assign("recipient", dto?.recipient);

        this.accountName = this.assign("accountName", dto?.accountName);
        this.paymentMethod = this.assign("paymentMethod", new PaymentMethod(dto?.paymentMethod));

    }

}