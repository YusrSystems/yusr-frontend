import { ChangeableEntity, ChangeableEntityMode, DateService, Dto, i18n, Validators } from "yusr-ui";
import { Signal } from "@preact/signals-react";
import { PaymentMethod, type PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import type { TFunction } from "i18next";
import { type ITransactionEntity, TransactionStatus } from "@/core/types/transactionStatus";


export enum VoucherType
{
	Payment = 1,
	Receipt = 2
}

export class VoucherDto extends Dto implements ITransactionEntity
{
	public type!: VoucherType;
	public date!: string;
	public amount!: number;
	public commissionAmount!: number;
	public glAccountId!: number;
	public glAccountName!: string;
	public partnerId?: number;
	public partnerName?: string;
	public paymentMethodId!: number;
	public paymentMethodName!: string;
	public description?: string;
	public invoiceId?: number;
	public giver?: string;
	public recipient?: string;
	public notes?: string;
	public rowVer!: number;
	public isDirectMode!: boolean;
	public transactionStatus: TransactionStatus = TransactionStatus.Draft;

	public paymentMethod?: PaymentMethodDto;
}

export class Voucher extends ChangeableEntity<VoucherDto>
{
	public type: Signal<VoucherType>;
	public date: Signal<string>;
	public amount: Signal<number>;
	public commissionAmount: Signal<number>;
	public glAccountId: Signal<number | undefined>;
	public glAccountName: Signal<string | undefined>;
	public partnerId: Signal<number | undefined>;
	public partnerName: Signal<string | undefined>;
	public paymentMethodId: Signal<number>;
	public paymentMethodName: Signal<string>;
	public description: Signal<string | undefined>;
	public invoiceId: Signal<number | undefined>;
	public giver: Signal<string | undefined>;
	public recipient: Signal<string | undefined>;
	public notes: Signal<string | undefined>;
	public rowVer: Signal<number>;
	public isDirectMode: Signal<boolean>;
	public transactionStatus: Signal<TransactionStatus>;

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
			field: "glAccountId",
			selector: (d) => d.glAccountId,
			validators: [
				Validators.custom((val, form) =>
				{
					if (!form.isDirectMode) return true;
					return val && Number(val) > 0;
				}, i18n.t("accounting:vouchers.categoryRequired", "الحساب مطلوب"))
			]
		}, {
			field: "partnerId",
			selector: (d) => d.partnerId,
			validators: [
				Validators.custom((val, form) =>
				{
					if (form.isDirectMode) return true;
					return val && Number(val) > 0;
				}, i18n.t("accounting:vouchers.partnerRequired", "الجهة مطلوبة"))
			]
		}, {
			field: "paymentMethodId",
			selector: (d) => d.paymentMethodId,
			validators: [Validators.required(i18n.t("accounting:vouchers.paymentMethodRequired"))]
		}], mode);

		this.type = this.assign("type", dto?.type ?? VoucherType.Payment);
		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.amount = this.assign("amount", dto?.amount ?? 0);
		this.commissionAmount = this.assign("commissionAmount", dto?.commissionAmount ?? 0);

		this.glAccountId = this.assign("glAccountId", dto?.glAccountId);
		this.glAccountName = this.assign("glAccountName", dto?.glAccountName ?? "");
		this.partnerId = this.assign("partnerId", dto?.partnerId);
		this.partnerName = this.assign("partnerName", dto?.partnerName);

		this.paymentMethodId = this.assign("paymentMethodId", dto?.paymentMethodId);
		this.paymentMethodName = this.assign("paymentMethodName", dto?.paymentMethodName ?? "");
		this.description = this.assign("description", dto?.description);
		this.invoiceId = this.assign("invoiceId", dto?.invoiceId);
		this.giver = this.assign("giver", dto?.giver);
		this.recipient = this.assign("recipient", dto?.recipient);
		this.notes = this.assign("notes", dto?.notes);
		this.rowVer = this.assign("rowVer", dto?.rowVer ?? 0);
		this.isDirectMode = this.assign("isDirectMode", dto?.isDirectMode ?? false);
		this.transactionStatus = this.assign("transactionStatus", dto?.transactionStatus ?? TransactionStatus.Draft);

		this.paymentMethod = this.assign("paymentMethod", new PaymentMethod(dto?.paymentMethod));
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