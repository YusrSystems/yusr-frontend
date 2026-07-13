import { ChangeableEntity, ChangeableEntityMode, DateService, Dto, i18n, Validators } from "yusr-ui";
import { Signal } from "@preact/signals-react";
import { PaymentMethod, type PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import type { TFunction } from "i18next";


export const VoucherType = {
	Payment: 1,
	Receipt: 2
} as const;
export type VoucherType = (typeof VoucherType)[keyof typeof VoucherType];

export class VoucherDto extends Dto
{
	public type!: VoucherType;
	public date!: string;
	public amount!: number;
	public isAmountDue!: boolean;
	public commissionAmount!: number;
	public accountId!: number;
	public paymentMethodId!: number;
	public description?: string;
	public invoiceId?: number;
	public giver?: string;
	public recipient?: string;
	public categoryId?: number;
	public categoryName?: string;
	public isDeleted: boolean = false;

	public accountName?: string;
	public paymentMethod?: PaymentMethodDto;
}

export class Voucher extends ChangeableEntity<VoucherDto>
{
	public type: Signal<VoucherType>;
	public date: Signal<string>;
	public amount: Signal<number>;
	public isAmountDue: Signal<boolean>;
	public commissionAmount: Signal<number>;
	public accountId: Signal<number>;
	public paymentMethodId: Signal<number>;
	public description: Signal<string>;
	public invoiceId: Signal<number>;
	public giver: Signal<string>;
	public recipient: Signal<string>;
	public categoryId: Signal<number>;
	public categoryName: Signal<string>;
	public isDeleted: Signal<boolean>;

	public accountName: Signal<string>;
	public paymentMethod: Signal<PaymentMethod>;

	constructor(dto?: Partial<VoucherDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
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

		this.type = this.assign("type", dto?.type ? dto.type : VoucherType.Payment);
		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.amount = this.assign("amount", dto?.amount);
		this.isAmountDue = this.assign("isAmountDue", dto?.isAmountDue);
		this.commissionAmount = this.assign("commissionAmount", dto?.commissionAmount);
		this.accountId = this.assign("accountId", dto?.accountId);
		this.paymentMethodId = this.assign("paymentMethodId", dto?.paymentMethodId);
		this.description = this.assign("description", dto?.description);
		this.invoiceId = this.assign("invoiceId", dto?.invoiceId);
		this.giver = this.assign("giver", dto?.giver);
		this.recipient = this.assign("recipient", dto?.recipient);
		this.accountName = this.assign("accountName", dto?.accountName);
		this.paymentMethod = this.assign("paymentMethod", new PaymentMethod(dto?.paymentMethod));
		this.categoryId = this.assign("categoryId", dto?.categoryId);
		this.categoryName = this.assign("categoryName", dto?.categoryName);
		this.isDeleted = this.assign("isDeleted", dto?.isDeleted);
	}

	public static getTypeName(type: VoucherType, t: TFunction<"accounting">)
	{
		switch (type)
		{
			case VoucherType.Payment:
				return t("vouchers.paymentVoucher");
			case VoucherType.Receipt:
				return t("vouchers.receiptVoucher");
			default:
				return String(type);
		}
	}
}

export class VoucherCategoryDto extends Dto
{
	public name!: string;
}