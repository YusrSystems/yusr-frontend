import { InvoiceItem, type InvoiceItemDto } from "@/core/data/invoices/invoiceItem.ts";

import { InvoiceVoucher, type InvoiceVoucherDto } from "@/core/data/invoices/invoiceVoucher.ts";
import { Services } from "@/core/services/services.ts";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath.ts";
import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, DateService, Dto, i18n, StorageFile, Validators } from "yusr-ui";
import Item from "@/core/data/item.ts";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { InvoiceStatus } from "@/core/types/invoiceStatus.ts";
import { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus";
import type { ImportExportType } from "@/core/types/importExportType.ts";
import { InvoiceRelationType } from "@/core/types/invoiceRelationType.ts";
import { PaymentStatus } from "@/core/types/paymentStatus.ts";


export class InvoiceMode
{
	static readonly Normal = new InvoiceMode("normal");
	static readonly Return = new InvoiceMode("return");
	static readonly Copy = new InvoiceMode("copy");
	static readonly QuotationToSales = new InvoiceMode("quotationToSales");

	protected dummyText?: string = "this dummy text prevents you from comparing mode with strings.";

	constructor(modeName: string)
	{
		this.dummyText = modeName;
	}
}

export class InvoiceDto extends Dto
{
	public invoiceMode: InvoiceMode = InvoiceMode.Normal;
	public type!: InvoiceType;
	public originalInvoiceId?: number;
	public date!: string;
	public delegateEmp?: string;
	public statusId!: InvoiceStatus;
	public eInvoiceStatus!: EInvoiceStatus;
	public fullAmount!: number;
	public paidAmount!: number;
	public settlementReason?: string;
	public settlementAmount!: number;
	public settlementPercent!: number;
	public returnStatusId!: InvoiceReturnStatus;
	public paymentStatusId!: PaymentStatus;
	public storeId!: number;
	public actionAccountId!: number;
	public notes?: string;
	public policy?: string;
	public importExportType?: ImportExportType;

	public createdAt!: string | Date;
	public createdBy!: number;
	public updatedAt!: string | Date;
	public updatedBy!: number;
	public rowVer!: number;

	public actionAccountName!: string;
	public storeName!: string;

	public invoiceItems: InvoiceItemDto[] = [];
	public invoiceVouchers: InvoiceVoucherDto[] = [];
	public invoiceFiles: StorageFile[] = [];
	public ignoreWarnings: boolean = false;
}

export default class Invoice extends ChangeableEntity<InvoiceDto>
{
	public invoiceMode: Signal<InvoiceMode>;
	public type: Signal<InvoiceType>;
	public originalInvoiceId: Signal<number | undefined>;
	public date: Signal<string>;
	public delegateEmp: Signal<string | undefined>;
	public statusId: Signal<InvoiceStatus>;
	public eInvoiceStatus: Signal<EInvoiceStatus>;
	public fullAmount: Signal<number>;
	public paidAmount: Signal<number>;
	public settlementReason: Signal<string | undefined>;
	public settlementAmount: Signal<number>;
	public settlementPercent: Signal<number>;
	public returnStatusId: Signal<InvoiceReturnStatus>;
	public paymentStatusId!: Signal<PaymentStatus>;
	public storeId: Signal<number>;
	public actionAccountId: Signal<number>;
	public notes: Signal<string | undefined>;
	public policy: Signal<string | undefined>;
	public importExportType: Signal<ImportExportType | undefined>;

	public createdAt: Signal<string | Date>;
	public createdBy: Signal<number>;
	public updatedAt: Signal<string | Date>;
	public updatedBy: Signal<number>;
	public rowVer: Signal<number>;

	public actionAccountName: Signal<string | undefined>;
	public storeName: Signal<string | undefined>;

	public invoiceItems: Signal<InvoiceItem[]>;
	public invoiceVouchers: Signal<InvoiceVoucher[]>;
	public invoiceFiles: Signal<StorageFile[]>;
	public ignoreWarnings: Signal<boolean>;

	public get isDisabled()
	{
		return (this.mode.value === ChangeableEntityMode.Update || this.invoiceMode.value === InvoiceMode.Return) && this.type.value !== InvoiceType.Quotation;
	}

	constructor(dto: Partial<InvoiceDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [{
			field: "type",
			selector: (d) => d.type,
			validators: [Validators.required(i18n.t("accounting:invoices.typeRequired"))]
		}, {
			field: "date",
			selector: (d) => d.date,
			validators: [Validators.required(i18n.t("accounting:invoices.dateRequired"))]
		}, {
			field: "storeId",
			selector: (d) => d.storeId,
			validators: [Validators.required(i18n.t("accounting:invoices.storeRequired"))]
		}, {
			field: "actionAccountId",
			selector: (d) => d.actionAccountId,
			validators: [Validators.required(i18n.t("accounting:invoices.accountRequired"))]
		}, {
			field: "invoiceItems",
			selector: (d) => d.invoiceItems,
			validators: [Validators.arrayMinLength(1, i18n.t("accounting:invoices.itemsRequired"))]
		}], mode);

		this.invoiceMode = this.assign("invoiceMode", dto?.invoiceMode ?? InvoiceMode.Normal);
		this.type = this.assign("type", dto?.type ?? InvoiceType.Sell);
		this.originalInvoiceId = this.assign("originalInvoiceId", dto?.originalInvoiceId);
		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.delegateEmp = this.assign("delegateEmp", dto?.delegateEmp);
		this.statusId = this.assign("statusId", dto?.statusId ?? InvoiceStatus.Valid);
		this.eInvoiceStatus = this.assign("eInvoiceStatus", dto?.eInvoiceStatus ?? EInvoiceStatus.NotSent);
		this.fullAmount = this.assign("fullAmount", dto?.fullAmount ?? 0);
		this.paidAmount = this.assign("paidAmount", dto?.paidAmount ?? 0);
		this.settlementReason = this.assign("settlementReason", dto?.settlementReason);
		this.settlementAmount = this.assign("settlementAmount", dto?.settlementAmount ?? 0);
		this.settlementPercent = this.assign("settlementPercent", dto?.settlementPercent ?? 0);
		this.returnStatusId = this.assign("returnStatusId", dto?.returnStatusId ?? InvoiceReturnStatus.NotReturned);
		this.paymentStatusId = this.assign("paymentStatusId", dto?.paymentStatusId ?? PaymentStatus.NotPaid);

		this.storeId = this.assign("storeId", dto?.storeId ?? Services.auth.setting?.mainStoreId.value);
		this.storeName = this.assign("storeName", dto?.storeName ?? Services.auth.setting?.mainStoreName.value);

		this.actionAccountId = this.assign("actionAccountId", dto?.actionAccountId ??
			(
				this.type.value === InvoiceType.Purchase
					? Services.auth.setting?.purchaseAccountId.value
					: (this.type.value === InvoiceType.Sell || this.type.value === InvoiceType.Quotation)
						? Services.auth.setting?.sellAccountId.value
						: undefined
			)
		);
		this.actionAccountName = this.assign("actionAccountName", dto?.actionAccountName ??
			(
				this.type.value === InvoiceType.Purchase
					? Services.auth.setting?.purchaseAccountName.value
					: (this.type.value === InvoiceType.Sell || this.type.value === InvoiceType.Quotation)
						? Services.auth.setting?.sellAccountName?.value
						: undefined
			));

		this.notes = this.assign("notes", dto?.notes);
		this.policy = this.assign("policy", dto?.policy);
		this.importExportType = this.assign("importExportType", dto?.importExportType);

		this.createdAt = this.assign("createdAt", dto?.createdAt);
		this.createdBy = this.assign("createdBy", dto?.createdBy);
		this.updatedAt = this.assign("updatedAt", dto?.updatedAt);
		this.updatedBy = this.assign("updatedBy", dto?.updatedBy);
		this.rowVer = this.assign("rowVer", dto?.rowVer);

		this.invoiceItems = this.assign("invoiceItems",
			(dto?.invoiceItems ?? []).map(x =>
			{
				const item = mode === ChangeableEntityMode.Update
					? InvoiceItem.load(x)
					: InvoiceItem.create(x);
				item.getInvoice = () => this;
				return item;
			})
		);
		this.invoiceVouchers = this.assign("invoiceVouchers",
			(dto?.invoiceVouchers ?? []).map(x =>
				mode === ChangeableEntityMode.Update
					? InvoiceVoucher.load(x)
					: InvoiceVoucher.create(x)
			)
		);

		this.invoiceFiles = this.assign("invoiceFiles", dto?.invoiceFiles ?? []);
		this.ignoreWarnings = this.assign("ignoreWarnings", dto?.ignoreWarnings ?? false);

		const checkChildren = () =>
		{
			this.hasChanges.value = this.invoiceVouchers.value.some((m) => m.hasChanges.value)
				|| this.invoiceItems.value.some((t) => t.hasChanges.value);
		};
		this.invoiceVouchers.value.forEach((t) => t.hasChanges.subscribe(checkChildren));
		this.invoiceItems.value.forEach((s) => s.hasChanges.subscribe(checkChildren));
	}

	override validate(dto?: Partial<InvoiceDto>): boolean
	{
		const invoiceResult = super.validate(dto);
		const itemsResult = this.invoiceItems.value.every((t) => t.validate());
		const vouchersResult = this.invoiceVouchers.value.every((m) => m.validate());
		return invoiceResult && itemsResult && vouchersResult;
	}

	public paymentVouchers()
	{
		return this.invoiceVouchers.value?.filter((v) => v.invoiceRelationType.value == InvoiceRelationType.Payment) ?? [];
	}

	public costVouchers()
	{
		return this.invoiceVouchers.value?.filter((v) => v.invoiceRelationType.value == InvoiceRelationType.Cost) ?? [];
	}

	public resetPaymentVouchers()
	{
		this.invoiceVouchers.value = this.invoiceVouchers.value?.filter((v) =>
			v.invoiceRelationType.value !== InvoiceRelationType.Payment
		);
	}

	public updatePaidAmount()
	{
		this.paidAmount.value = InvoiceItemsMath.CalcInvoicePaidPrice(this.invoiceVouchers.value);
	}

	public createInitialPaymentVoucher(taxInclusivePrice: number)
	{
		return InvoiceVoucher.create({
			invoiceId: this.id.value,
			paymentMethodId: Services.auth.setting?.mainPaymentMethodId?.value,
			paymentMethodName: Services.auth.setting?.mainPaymentMethodName?.value,
			accountId: this.actionAccountId.value,
			accountName: this.actionAccountName.value,
			invoiceRelationType: InvoiceRelationType.Payment,
			amount: taxInclusivePrice,
			amountReceived: taxInclusivePrice
		});
	}

	public syncPaymentVouchers()
	{

		if (this.mode.value === ChangeableEntityMode.Update)
		{
			return;
		}

		const taxInclusivePrice = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(this.invoiceItems.value ?? []);
		const vouchers = this.paymentVouchers();

		if (this.type.value === InvoiceType.Quotation)
		{
			this.resetPaymentVouchers();
			this.fullAmount.value = taxInclusivePrice;
			return;
		}

		if (vouchers.length === 0)
		{
			this.resetPaymentVouchers();
			this.invoiceVouchers.value = [this.createInitialPaymentVoucher(taxInclusivePrice)];
		}
		else if (vouchers.length === 1 && vouchers[0])
		{
			const voucher = vouchers[0];
			voucher.amount.value = taxInclusivePrice;
			voucher.amountReceived.value = taxInclusivePrice;
			if (!voucher.accountId.value)
			{
				voucher.accountId.value = this.actionAccountId.value;
				voucher.accountName.value = this.actionAccountName.value;
			}
		}

		this.fullAmount.value = taxInclusivePrice;
		this.paidAmount.value = taxInclusivePrice;
	}

	public addItem(storeItem: Item)
	{
		const existingItem = this.invoiceItems.value?.find((item) => item.itemId.value === storeItem.id.value);

		if (existingItem)
		{
			return existingItem.incrementQuantity();
		}

		const newInvoiceItem = InvoiceItem.createFromItem(this, storeItem);
		this.invoiceItems.value = [...this.invoiceItems.value, newInvoiceItem];

		if (this.settlementPercent.value)
		{
			this.changeSettlementPercent(this.settlementPercent.value);
		}

		if (this.settlementAmount.value)
		{
			this.changeSettlementAmount(this.settlementAmount.value);
		}
	}

	public removeItem(index: number)
	{

		this.invoiceItems.value = this.invoiceItems.value.filter((_, i) =>
			i !== index
		);
		if (this.invoiceItems.value?.length === 0)
		{
			this.settlementAmount.value = 0;
			this.settlementPercent.value = 0;
		}

		if (this.settlementAmount.value)
		{
			this.changeSettlementAmount(this.settlementAmount.value);
		}
	}

	public removeVoucher(voucherId: Signal<number>): void
	{
		this.invoiceVouchers.value = this.invoiceVouchers.value?.filter((v) => v.voucherId.value !== voucherId.value);
	}

	public changeSettlementPercent(settlementPercent: number)
	{
		this.settlementPercent.value = settlementPercent;
		this.settlementAmount.value = 0;
		this._changeSettlement(settlementPercent);
	}

	public changeSettlementAmount(settlementAmount: number)
	{
		this.settlementAmount.value = settlementAmount;
		this.settlementPercent.value = 0;

		const basePrice = InvoiceItemsMath.CalcInvoiceBaseTaxInclusivePrice(this.invoiceItems.value ?? []);
		const exactPercent = basePrice === 0 ? 0 : (settlementAmount / basePrice) * 100;

		this._changeSettlement(exactPercent);

		// 2. --- PENNY ERROR CORRECTION ---
		if (basePrice !== 0 && this.invoiceItems.value && this.invoiceItems.value.length > 0)
		{
			const targetInvoicePrice = Number((basePrice + settlementAmount).toFixed(2));
			const currentInvoicePrice = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(this.invoiceItems.value);
			const diff = Number((targetInvoicePrice - currentInvoicePrice).toFixed(2));

			if (diff !== 0)
			{
				// Prefer an item with quantity == 1 to absorb the penny cleanly, otherwise fallback to the first item
				const targetItem = this.invoiceItems.value.find(i => i.quantity.value === 1) || this.invoiceItems.value[0];

				if (targetItem)
				{
					const settlementAdjustment = diff / targetItem.quantity.value;
					const adjustedSettlement = Number((targetItem.settlement.value + settlementAdjustment).toFixed(2));
					targetItem.changeSettlement(adjustedSettlement);
				}
			}
		}
	}

	private _changeSettlement(settlementPercent: number)
	{
		this.invoiceItems.value?.forEach((item) =>
		{
			const newSettlement = Number((item.taxInclusivePrice.value * (settlementPercent / 100)).toFixed(2));
			item.changeSettlement(newSettlement);
		});
	}
}