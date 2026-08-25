import { ChangeableEntityMode, DateService, StorageFile, SystemPermissionsActions } from "yusr-ui";
import { type Signal } from "@preact/signals-react";
import { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { Voucher, VoucherDto, VoucherType } from "@/core/data/voucher";
import { ItemDto, ItemType } from "@/core/data/item";
import { Services } from "@/core/services/services";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { SalesInvoiceType } from "@/core/types/commercialEnums";
import {
	CommercialInvoiceDocument,
	CommercialInvoiceMode,
	type ICommercialInvoiceDocumentDto
} from "./commercialInvoiceDocument";
import { CommercialItem, type ICommercialItemDto } from "./commercialItem";
import type { ItemUoMDto } from "@/core/data/itemUoM";
import type { QuotationDto } from "./quotation";
import type { ImportExportType } from "@/core/types/importExportType.ts";


export { CommercialInvoiceMode as SalesInvoiceMode } from "./commercialInvoiceDocument";

export class SalesInvoiceItemDto implements ICommercialItemDto
{
	public id!: number;
	public index!: number;
	public salesInvoiceId!: number;
	public itemId!: number;
	public itemType!: ItemType;
	public itemUoMId!: number;
	public pricingMethodId!: number;
	public quantity!: number;
	public originalQuantity!: number;
	public originalCost!: number;
	public cost!: number;
	public taxExclusivePrice!: number;
	public taxInclusivePrice!: number;
	public originalTaxInclusivePrice!: number;
	public taxExclusiveTotalPrice!: number;
	public taxInclusiveTotalPrice!: number;
	public settlement!: number;
	public taxable!: boolean;
	public taxIncluded!: boolean;
	public totalTaxesPerc!: number;
	public notes?: string;
	public itemName!: string;
	public unitName!: string;
	public pricingMethodName?: string;
	public uoMDtos: ItemUoMDto[] = [];
}

export class SalesInvoiceDto implements ICommercialInvoiceDocumentDto
{
	public id!: number;
	public invoiceMode: CommercialInvoiceMode = CommercialInvoiceMode.Normal;
	public type!: SalesInvoiceType;
	public originalSalesInvoiceId?: number;
	public basedOnQuotationId?: number;
	public posSessionId?: number;
	public date!: string;
	public delegateEmp?: string;
	public eInvoiceStatus!: EInvoiceStatus;
	public fullAmount!: number;
	public paidAmount!: number;
	public settlementReason?: string;
	public settlementAmount!: number;
	public settlementPercent!: number;
	public returnStatusId!: number;
	public paymentStatusId!: number;
	public storeId!: number;
	public partnerId!: number;
	public notes?: string;
	public policy?: string;
	public importExportType!: ImportExportType;
	public canBePrinted?: boolean;
	public createdAt!: string | Date;
	public createdBy!: number;
	public updatedAt!: string | Date;
	public updatedBy!: number;
	public rowVer!: number;
	public idempotencyKey?: string;
	public partnerName?: string;
	public storeName?: string;
	public items: SalesInvoiceItemDto[] = [];
	public costVouchers: VoucherDto[] = [];
	public paymentVouchers: VoucherDto[] = [];
	public files: StorageFile[] = [];
	public ignoreWarnings: boolean = false;
	public deleteOriginalInvoiceCostVouchers: boolean = false;
}

export class SalesInvoiceItem extends CommercialItem<SalesInvoiceItemDto, SalesInvoice>
{
	public salesInvoiceId: Signal<number>;

	constructor(dto?: Partial<SalesInvoiceItemDto>)
	{
		super(dto, ChangeableEntityMode.Create);
		this.salesInvoiceId = this.assign("salesInvoiceId", dto?.salesInvoiceId ?? 0);
	}

	public static createFromItem(
		invoice: SalesInvoice,
		item: ItemDto,
		selectedUoMId?: number,
		selectedPricingMethodId?: number
	): SalesInvoiceItem
	{
		const dto = CommercialItem.buildLineDto<SalesInvoiceItemDto>({
			doc: invoice,
			item,
			index: invoice.items.value?.length ?? 0,
			selectedUoMId,
			selectedPricingMethodId,
			resolveQuantity: (itm, storeQty, multiplier) =>
			{
				if (itm.type === ItemType.Service) return 1;
				if (storeQty >= multiplier) return 1;
				return Services.auth.hasAuth(
					SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity,
					SystemPermissionsActions.Get
				)
					? 1
					: 0;
			}
		});

		dto.salesInvoiceId = invoice.id.value;
		const line = new SalesInvoiceItem(dto);
		line.quantityMultiplier.value = dto.uoMDtos.find((u) => u.id === dto.itemUoMId)?.quantityMultiplier ?? 1;
		line.getDocument = () => invoice;
		return line;
	}
}

export class SalesInvoice extends CommercialInvoiceDocument<SalesInvoiceDto, SalesInvoiceItem, SalesInvoiceItemDto>
{
	public type: Signal<SalesInvoiceType>;
	public originalSalesInvoiceId: Signal<number | undefined>;
	public basedOnQuotationId: Signal<number | undefined>;
	public posSessionId: Signal<number | undefined>;
	public delegateEmp: Signal<string | undefined>;
	public eInvoiceStatus: Signal<EInvoiceStatus>;
	public canBePrinted: Signal<boolean | undefined>;
	public costVouchers: Signal<Voucher[]>;
	public ignoreWarnings: Signal<boolean>;

	constructor(dto?: Partial<SalesInvoiceDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, mode);
		this.type = this.assign("type", dto?.type ?? SalesInvoiceType.Invoice);
		this.originalSalesInvoiceId = this.assign("originalSalesInvoiceId", dto?.originalSalesInvoiceId);
		this.basedOnQuotationId = this.assign("basedOnQuotationId", dto?.basedOnQuotationId);
		this.posSessionId = this.assign("posSessionId", dto?.posSessionId);
		this.delegateEmp = this.assign("delegateEmp", dto?.delegateEmp);
		this.eInvoiceStatus = this.assign("eInvoiceStatus", dto?.eInvoiceStatus ?? EInvoiceStatus.NotSent);
		this.canBePrinted = this.assign("canBePrinted", dto?.canBePrinted);
		this.ignoreWarnings = this.assign("ignoreWarnings", dto?.ignoreWarnings ?? false);

		this.partnerId.value = dto?.partnerId ?? (Services.auth.setting?.defaultCustomerPartnerId.value || 0);
		this.partnerName.value = dto?.partnerName ?? Services.auth.setting?.defaultCustomerPartnerName.value;
		this.policy.value = dto?.policy ?? Services.auth.setting?.saleInvoicePolicy?.value;

		this.items = this.assign(
			"items",
			(dto?.items ?? []).map((x) =>
			{
				const item = mode === ChangeableEntityMode.Update ? SalesInvoiceItem.load(x) : SalesInvoiceItem.create(x);
				item.getDocument = () => this;
				return item;
			})
		);

		this.costVouchers = this.assign(
			"costVouchers",
			(dto?.costVouchers ?? []).map((x) =>
				mode === ChangeableEntityMode.Update ? Voucher.load(x) : Voucher.create(x)
			)
		);

		const checkChildren = () =>
		{
			this.hasChanges.value =
				this.costVouchers.value.some((v) => v.hasChanges.value) ||
				this.paymentVouchers.value.some((v) => v.hasChanges.value) ||
				this.items.value.some((v) => v.hasChanges.value);
		};
		this.items.value.forEach((s) => s.hasChanges.subscribe(checkChildren));
		this.costVouchers.value.forEach((t) => t.hasChanges.subscribe(checkChildren));
	}

	public loadFromQuotation(quotation: QuotationDto): void
	{
		this.copyFromDocument(quotation);
		this.basedOnQuotationId.value = quotation.id;
		this.delegateEmp.value = quotation.delegateEmp;
		if (Services.auth.setting?.saleInvoicePolicy?.value)
		{
			this.policy.value = Services.auth.setting.saleInvoicePolicy.value;
		}

		this.items.value = (quotation.items || []).map((qi, idx) =>
		{
			const line = new SalesInvoiceItem({
				...qi,
				id: 0,
				index: idx,
				salesInvoiceId: 0
			});
			line.quantityMultiplier.value = qi.uoMDtos?.find((u) => u.id === qi.itemUoMId)?.quantityMultiplier ?? 1;
			line.getDocument = () => this;
			return line;
		});

		this.syncTotals();
	}

	public loadFromReturn(source: SalesInvoiceDto): void
	{
		this.copyFromDocument(source);
		this.type.value = SalesInvoiceType.CreditNote;
		this.originalSalesInvoiceId.value = source.id;
		this.delegateEmp.value = source.delegateEmp;
		this.date.value = DateService.formatDateOnly(new Date());
		this.invoiceMode.value = CommercialInvoiceMode.Return;
		this.costVouchers.value = [];
		this.items.value = (source.items || []).map((qi, idx) =>
		{
			const line = new SalesInvoiceItem({
				...qi,
				id: 0,
				index: idx,
				salesInvoiceId: 0
			});
			line.quantityMultiplier.value = qi.uoMDtos?.find((u) => u.id === qi.itemUoMId)?.quantityMultiplier ?? 1;
			line.getDocument = () => this;
			return line;
		});

		this.syncTotals();
	}

	public loadFromCopy(source: SalesInvoiceDto): void
	{
		this.copyFromDocument(source);
		this.type.value = SalesInvoiceType.Invoice;
		this.originalSalesInvoiceId.value = undefined;
		this.basedOnQuotationId.value = undefined;
		this.date.value = DateService.formatDateOnly(new Date());

		this.items.value = (source.items || []).map((qi, idx) =>
		{
			const line = new SalesInvoiceItem({
				...qi,
				id: 0,
				index: idx,
				salesInvoiceId: 0
			});
			line.quantityMultiplier.value = qi.uoMDtos?.find((u) => u.id === qi.itemUoMId)?.quantityMultiplier ?? 1;
			line.getDocument = () => this;
			return line;
		});

		this.syncTotals();
	}

	override validate(dto?: Partial<SalesInvoiceDto>): boolean
	{
		const baseValid = super.validate(dto);
		const costsValid = this.costVouchers.value.every((v) => v.validate());
		return baseValid && costsValid;
	}

	protected override getInitialVoucherType(): VoucherType
	{
		return this.type.value === SalesInvoiceType.CreditNote ? VoucherType.Payment : VoucherType.Receipt;
	}

	protected override assignVoucherDocumentId(voucher: Voucher): void
	{
		voucher.salesInvoiceId.value = this.id.value;
	}

	protected override createLineFromItem(
		storeItem: ItemDto,
		selectedUoMId?: number,
		selectedPricingMethodId?: number
	): SalesInvoiceItem
	{
		return SalesInvoiceItem.createFromItem(this, storeItem, selectedUoMId, selectedPricingMethodId);
	}
}