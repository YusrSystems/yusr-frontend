import { InvoiceItem, type InvoiceItemDto } from "@/core/data/invoices/invoiceItem.ts";

import { InvoiceVoucher, type InvoiceVoucherDto } from "@/core/data/invoices/invoiceVoucher.ts";
import { Services } from "@/core/services/services.ts";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath.ts";
import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, StorageFile, Validators } from "yusr-ui";
import type Item from "@/core/data/item.ts";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { InvoiceStatus } from "@/core/types/invoiceStatus.ts";
import { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus";
import type { ImportExportType } from "@/core/types/importExportType.ts";
import { InvoiceRelationType } from "@/core/types/invoiceRelationType.ts";


export class InvoiceDto extends Dto
{
	public type!: InvoiceType;
	public originalInvoiceId?: number;
	public date!: string | Date;
	public delegateEmp?: string;
	public statusId!: InvoiceStatus;
	public eInvoiceStatus!: EInvoiceStatus;
	public fullAmount!: number;
	public paidAmount!: number;
	public settlementReason?: string;
	public settlementAmount!: number;
	public settlementPercent!: number;
	public returnStatusId!: InvoiceReturnStatus;
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

export const InvoiceMode = {
	...ChangeableEntityMode,
	Return: "return",
	Copy: "copy",
	QuotationToSales: "quotationToSales"
} as const;
export type InvoiceMode = typeof InvoiceMode[keyof typeof InvoiceMode];

export default class Invoice extends ChangeableEntity<InvoiceDto, InvoiceMode>
{
	public type: Signal<InvoiceType>;
	public originalInvoiceId: Signal<number | undefined>;
	public date: Signal<Date>;
	public delegateEmp: Signal<string | undefined>;
	public statusId: Signal<InvoiceStatus>;
	public eInvoiceStatus: Signal<EInvoiceStatus>;
	public fullAmount: Signal<number>;
	public paidAmount: Signal<number>;
	public settlementReason: Signal<string | undefined>;
	public settlementAmount: Signal<number>;
	public settlementPercent: Signal<number>;
	public returnStatusId: Signal<InvoiceReturnStatus>;
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

	constructor(dto: Partial<InvoiceDto> | undefined, mode: InvoiceMode)
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

		this.type = this.assign("type", dto?.type ?? InvoiceType.Sell);
		this.originalInvoiceId = this.assign("originalInvoiceId", dto?.originalInvoiceId);
		this.date = this.assign("date", dto?.date ? new Date(dto?.date) : new Date());
		this.delegateEmp = this.assign("delegateEmp", dto?.delegateEmp);
		this.statusId = this.assign("statusId", dto?.statusId ?? InvoiceStatus.Valid);
		this.eInvoiceStatus = this.assign("eInvoiceStatus", dto?.eInvoiceStatus ?? EInvoiceStatus.NotSent);
		this.fullAmount = this.assign("fullAmount", dto?.fullAmount ?? 0);
		this.paidAmount = this.assign("paidAmount", dto?.paidAmount ?? 0);
		this.settlementReason = this.assign("settlementReason", dto?.settlementReason);
		this.settlementAmount = this.assign("settlementAmount", dto?.settlementAmount ?? 0);
		this.settlementPercent = this.assign("settlementPercent", dto?.settlementPercent ?? 0);
		this.returnStatusId = this.assign("returnStatusId", dto?.returnStatusId ?? InvoiceReturnStatus.NotReturned);
		this.storeId = this.assign("storeId", dto?.storeId ?? 0);
		this.actionAccountId = this.assign("actionAccountId", dto?.actionAccountId ?? 0);
		this.notes = this.assign("notes", dto?.notes);
		this.policy = this.assign("policy", dto?.policy);
		this.importExportType = this.assign("importExportType", dto?.importExportType);

		this.createdAt = this.assign("createdAt", dto?.createdAt ?? new Date());
		this.createdBy = this.assign("createdBy", dto?.createdBy ?? 0);
		this.updatedAt = this.assign("updatedAt", dto?.updatedAt ?? new Date());
		this.updatedBy = this.assign("updatedBy", dto?.updatedBy ?? 0);
		this.rowVer = this.assign("rowVer", dto?.rowVer ?? 0);

		this.actionAccountName = this.assign("actionAccountName", dto?.actionAccountName);
		this.storeName = this.assign("storeName", dto?.storeName);

		this.invoiceItems = this.assign("invoiceItems",
			(dto?.invoiceItems ?? []).map(x =>
			{
				const item = InvoiceItem.create(x);
				item.getInvoice = () => this;
				return item;
			})
		);
		this.invoiceVouchers = this.assign("invoiceVouchers", (dto?.invoiceVouchers ?? []).map(x => InvoiceVoucher.create(x)));
		this.invoiceFiles = this.assign("invoiceFiles", dto?.invoiceFiles ?? []);
		this.ignoreWarnings = this.assign("ignoreWarnings", dto?.ignoreWarnings ?? false);
	}

	public get isDisabled()
	{
		return this.mode.value === InvoiceMode.Update && this.type.value !== InvoiceType.Quotation;
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
		if (this.mode.value === "update")
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
			this.createInitialPaymentVoucher(taxInclusivePrice);
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

	public changeSettlementPercent(settlementPercent: number)
	{
		this.settlementPercent.value = settlementPercent;
		this.settlementAmount.value = 0;
		this.invoiceItems.value?.forEach((item) =>
		{
			const newSettlement = Number(
				(item.taxInclusivePrice.value * ((this.settlementPercent.value ?? 0) / 100)).toFixed(2)
			);

			item.changeSettlement(newSettlement);
		});
	}

	public changeSettlementAmount(settlementAmount: number)
	{
		this.settlementAmount.value = settlementAmount;
		this.settlementPercent.value = 0;
		this.invoiceItems.value?.forEach((item) =>
		{
			item.changeSettlement(settlementAmount);
		});
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
			this.changeSettlementPercent(this.settlementAmount.value);
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
	}

	public removeVoucher(voucherId: Signal<number>): void
	{
		this.invoiceVouchers.value = this.invoiceVouchers.value?.filter((v) => v.voucherId.value !== voucherId.value);
	}
}