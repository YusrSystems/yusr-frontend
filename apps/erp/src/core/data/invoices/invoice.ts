import { InvoiceItem, type InvoiceItemDto } from "@/core/data/invoices/invoiceItem.ts";
import { Services } from "@/core/services/services.ts";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath.ts";
import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, DateService, Dto, i18n, StorageFile, Validators } from "yusr-ui";
import { ItemDto } from "@/core/data/item.ts";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { InvoiceReturnStatus } from "@/core/types/invoiceReturnStatus";
import type { ImportExportType } from "@/core/types/importExportType.ts";
import { PaymentStatus } from "@/core/types/paymentStatus.ts";
import type { TFunction } from "i18next";
import { Voucher, VoucherDto, VoucherType } from "@/core/data/voucher.ts";
import type { PartnerType } from "@/core/data/partner.ts";


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
	public eInvoiceStatus!: EInvoiceStatus;
	public fullAmount!: number;
	public paidAmount!: number;
	public settlementReason?: string;
	public settlementAmount!: number;
	public settlementPercent!: number;
	public returnStatusId!: InvoiceReturnStatus;
	public paymentStatusId!: PaymentStatus;
	public storeId!: number;
	public partnerId!: number;
	public notes?: string;
	public policy?: string;
	public importExportType?: ImportExportType;
	public deleteOriginalInvoiceCostVouchers!: boolean;

	public createdAt!: string | Date;
	public createdBy!: number;
	public updatedAt!: string | Date;
	public updatedBy!: number;
	public rowVer!: number;
	public canBePrinted!: boolean;
	public idempotencyKey?: string;

	public partnerName!: string;
	public partnerType!: PartnerType;
	public storeName!: string;

	public invoiceItems: InvoiceItemDto[] = [];
	public costVouchers: VoucherDto[] = [];
	public paymentVouchers: VoucherDto[] = [];
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
	public eInvoiceStatus: Signal<EInvoiceStatus>;
	public fullAmount: Signal<number>;
	public paidAmount: Signal<number>;
	public settlementReason: Signal<string | undefined>;
	public settlementAmount: Signal<number>;
	public settlementPercent: Signal<number>;
	public returnStatusId: Signal<InvoiceReturnStatus>;
	public paymentStatusId!: Signal<PaymentStatus>;
	public storeId: Signal<number>;
	public partnerId: Signal<number>;
	public notes: Signal<string | undefined>;
	public policy: Signal<string | undefined>;
	public importExportType: Signal<ImportExportType | undefined>;
	public deleteOriginalInvoiceCostVouchers: Signal<boolean | undefined>;

	public createdAt: Signal<string | Date>;
	public createdBy: Signal<number>;
	public updatedAt: Signal<string | Date>;
	public updatedBy: Signal<number>;
	public rowVer: Signal<number>;
	public idempotencyKey: Signal<string | undefined>;

	public partnerName: Signal<string | undefined>;
	public storeName: Signal<string | undefined>;

	public invoiceItems: Signal<InvoiceItem[]>;
	public costVouchers: Signal<Voucher[]>;
	public paymentVouchers: Signal<Voucher[]>;
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
			field: "partnerId",
			selector: (d) => d.partnerId,
			validators: [Validators.required("الجهة مطلوبة")]
		}, {
			field: "invoiceItems",
			selector: (d) => d.invoiceItems,
			validators: [Validators.arrayMinLength(1, i18n.t("accounting:invoices.itemsRequired"))]
		}, {
			field: "invoiceFiles",
			selector: (d) => d.invoiceFiles,
			validators: [Validators.arrayMaxLength(3)]
		}], mode);

		this.invoiceMode = this.assign("invoiceMode", dto?.invoiceMode ?? InvoiceMode.Normal);
		this.type = this.assign("type", dto?.type ?? InvoiceType.Sell);
		this.originalInvoiceId = this.assign("originalInvoiceId", dto?.originalInvoiceId);
		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.delegateEmp = this.assign("delegateEmp", dto?.delegateEmp);
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

		this.partnerId = this.assign("partnerId", dto?.partnerId ??
			(
				this.type.value === InvoiceType.Purchase
					? Services.auth.setting?.defaultSupplierPartnerId.value
					: (this.type.value === InvoiceType.Sell || this.type.value === InvoiceType.Quotation)
						? Services.auth.setting?.defaultCustomerPartnerId.value
						: undefined
			)
		);
		this.partnerName = this.assign("partnerName", dto?.partnerName ??
			(
				this.type.value === InvoiceType.Purchase
					? Services.auth.setting?.defaultSupplierPartnerName.value
					: (this.type.value === InvoiceType.Sell || this.type.value === InvoiceType.Quotation)
						? Services.auth.setting?.defaultCustomerPartnerName.value
						: undefined
			));

		this.notes = this.assign("notes", dto?.notes);

		this.policy = this.assign("policy", dto?.policy ?? Services.auth.setting?.getInvoicePolicy(this.type.value));

		this.importExportType = this.assign("importExportType", dto?.importExportType);

		this.deleteOriginalInvoiceCostVouchers = this.assign("deleteOriginalInvoiceCostVouchers", dto?.deleteOriginalInvoiceCostVouchers ?? false);

		this.createdAt = this.assign("createdAt", dto?.createdAt);
		this.createdBy = this.assign("createdBy", dto?.createdBy);
		this.updatedAt = this.assign("updatedAt", dto?.updatedAt);
		this.updatedBy = this.assign("updatedBy", dto?.updatedBy);
		this.rowVer = this.assign("rowVer", dto?.rowVer);
		this.idempotencyKey = this.assign("idempotencyKey", dto?.idempotencyKey ?? crypto.randomUUID());

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

		this.costVouchers = this.assign("costVouchers",
			(dto?.costVouchers ?? []).map(x =>
				mode === ChangeableEntityMode.Update
					? Voucher.load(x)
					: Voucher.create(x)
			)
		);
		this.paymentVouchers = this.assign("paymentVouchers",
			(dto?.paymentVouchers ?? []).map(x =>
				mode === ChangeableEntityMode.Update
					? Voucher.load(x)
					: Voucher.create(x)
			)
		);

		this.invoiceFiles = this.assign("invoiceFiles", dto?.invoiceFiles ?? []);
		this.ignoreWarnings = this.assign("ignoreWarnings", dto?.ignoreWarnings ?? false);

		const checkChildren = () =>
		{
			this.hasChanges.value = this.costVouchers.value.some((v) => v.hasChanges.value)
				|| this.paymentVouchers.value.some((v) => v.hasChanges.value)
				|| this.invoiceItems.value.some((t) => t.hasChanges.value);
		};

		this.costVouchers.value.forEach((t) => t.hasChanges.subscribe(checkChildren));
		this.paymentVouchers.value.forEach((t) => t.hasChanges.subscribe(checkChildren));
		this.invoiceItems.value.forEach((s) => s.hasChanges.subscribe(checkChildren));
	}

	public static getTypeName(type: InvoiceType, t: TFunction<"accounting">)
	{
		switch (type)
		{
			case InvoiceType.Sell:
				return t("invoices.sellInvoice");
			case InvoiceType.Purchase:
				return t("invoices.purchaseInvoice");
			case InvoiceType.SellReturn:
				return t("invoices.sellReturn");
			case InvoiceType.PurchaseReturn:
				return t("invoices.purchaseReturn");
			case InvoiceType.Quotation:
				return t("invoices.quotation");
			default:
				return String(type);
		}
	}

	public static getRouteName(type: InvoiceType)
	{
		switch (type)
		{
			case InvoiceType.Sell:
			case InvoiceType.SellReturn:
				return "sales";
			case InvoiceType.Purchase:
			case InvoiceType.PurchaseReturn:
				return "purchases";
			case InvoiceType.Quotation:
				return "quotations";
			default:
				return "sales";
		}
	}

	override validate(dto?: Partial<InvoiceDto>): boolean
	{
		const invoiceResult = super.validate(dto);
		const itemsResult = this.invoiceItems.value.every((t) => t.validate());
		const costsResult = this.costVouchers.value.every((v) => v.validate());
		const paymentsResult = this.paymentVouchers.value.every((v) => v.validate());
		return invoiceResult && itemsResult && costsResult && paymentsResult;
	}

	public resetPaymentVouchers()
	{
		this.paymentVouchers.value = [];
	}

	public createInitialPaymentVoucher(taxInclusivePrice: number)
	{
		return Voucher.create({
			invoiceId: this.id.value,
			paymentMethodId: Services.auth.setting?.mainPaymentMethodId?.value,
			partnerId: this.partnerId.value,
			partnerName: this.partnerName.value,
			type: (this.type.value === InvoiceType.Sell || this.type.value === InvoiceType.PurchaseReturn) ? VoucherType.Receipt : VoucherType.Payment,
			amount: taxInclusivePrice
		});
	}

	public updatePaidAmount()
	{
		this.paidAmount.value = InvoiceItemsMath.CalcInvoicePaidPrice(this.paymentVouchers.value);
	}

	public syncPaymentVouchers()
	{

		if (this.mode.value === ChangeableEntityMode.Update)
		{
			return;
		}

		const taxInclusivePrice = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(this.invoiceItems.value ?? []);
		const vouchers = this.paymentVouchers.value;

		if (this.type.value === InvoiceType.Quotation)
		{
			this.resetPaymentVouchers();
			this.fullAmount.value = taxInclusivePrice;
			return;
		}

		if (taxInclusivePrice === 0)
		{
			this.resetPaymentVouchers();
		}
		else if (vouchers.length === 0)
		{
			this.resetPaymentVouchers();
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

		this.fullAmount.value = taxInclusivePrice;
		this.paidAmount.value = taxInclusivePrice;
	}

	public addItem(storeItem: ItemDto)
	{
		const existingItem = this.invoiceItems.value?.find((item) => item.itemId.value === storeItem.id);

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