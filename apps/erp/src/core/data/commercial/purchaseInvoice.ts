import { ChangeableEntityMode, StorageFile } from "yusr-ui";
import { type Signal } from "@preact/signals-react";
import { Voucher, VoucherDto, VoucherType } from "@/core/data/voucher";
import { ItemDto } from "@/core/data/item";
import { CommercialMath } from "@/features/commercial/logic/commercialMath";
import { Services } from "@/core/services/services";
import { PurchaseInvoiceType } from "@/core/types/commercialEnums";
import {
	CommercialInvoiceDocument,
	CommercialInvoiceMode,
	type ICommercialInvoiceDocumentDto
} from "./commercialInvoiceDocument";
import { CommercialItem, type ICommercialItemDto } from "./commercialItem";
import type { ItemUoMDto } from "@/core/data/itemUoM";
import { ImportExportType } from "@/core/types/importExportType.ts";


export { CommercialInvoiceMode as PurchaseInvoiceMode } from "./commercialInvoiceDocument";

export class PurchaseInvoiceItemDto implements ICommercialItemDto
{
	public id!: number;
	public index!: number;
	public purchaseInvoiceId!: number;
	public itemId!: number;
	public itemType!: number;
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

export class PurchaseInvoiceDto implements ICommercialInvoiceDocumentDto
{
	public id!: number;
	public invoiceMode: CommercialInvoiceMode = CommercialInvoiceMode.Normal;
	public type!: PurchaseInvoiceType;
	public originalPurchaseInvoiceId?: number;
	public goodsReceiptNoteId?: number;
	public vendorInvoiceNumber?: string;
	public vendorInvoiceDate?: string;
	public date!: string;
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
	public createdAt!: string | Date;
	public createdBy!: number;
	public updatedAt!: string | Date;
	public updatedBy!: number;
	public rowVer!: number;
	public idempotencyKey?: string;
	public partnerName?: string;
	public storeName?: string;
	public items: PurchaseInvoiceItemDto[] = [];
	public paymentVouchers: VoucherDto[] = [];
	public files: StorageFile[] = [];
	public deleteOriginalInvoiceCostVouchers: boolean = false;
}

export class PurchaseInvoiceItem extends CommercialItem<PurchaseInvoiceItemDto, PurchaseInvoice>
{
	public purchaseInvoiceId: Signal<number>;

	constructor(dto?: Partial<PurchaseInvoiceItemDto>)
	{
		super(dto, ChangeableEntityMode.Create);
		this.purchaseInvoiceId = this.assign("purchaseInvoiceId", dto?.purchaseInvoiceId ?? 0);
	}

	public static createFromItem(
		invoice: PurchaseInvoice,
		item: ItemDto,
		selectedUoMId?: number,
		selectedPricingMethodId?: number
	): PurchaseInvoiceItem
	{
		const dto = CommercialItem.buildLineDto<PurchaseInvoiceItemDto>({
			doc: invoice,
			item,
			index: invoice.items.value?.length ?? 0,
			selectedUoMId,
			selectedPricingMethodId,
			resolvePrice: (itm, _uom, _tier, multiplier) => (itm.lastBuyPrice ?? 0) * multiplier,
			resolveQuantity: () => 1
		});

		dto.purchaseInvoiceId = invoice.id.value;
		const line = new PurchaseInvoiceItem(dto);
		line.quantityMultiplier.value = dto.uoMDtos.find((u) => u.id === dto.itemUoMId)?.quantityMultiplier ?? 1;
		line.lastBuyPrice.value = item.lastBuyPrice ?? 0;
		line.getDocument = () => invoice;
		return line;
	}

	protected override applyPricingTier()
	{
		const price = (this.lastBuyPrice.value ?? 0) * (this.quantityMultiplier.value ?? 1);
		const {taxExclusivePrice, taxInclusivePrice} = CommercialMath.getPrices(
			this.taxIncluded.value,
			price,
			this.totalTaxesPerc.value ?? 0
		);
		this.changeTaxInclusivePrice(taxInclusivePrice, taxExclusivePrice);
	}
}

export class PurchaseInvoice extends CommercialInvoiceDocument<PurchaseInvoiceDto, PurchaseInvoiceItem, PurchaseInvoiceItemDto>
{
	public type: Signal<PurchaseInvoiceType>;
	public originalPurchaseInvoiceId: Signal<number | undefined>;
	public goodsReceiptNoteId: Signal<number | undefined>;
	public vendorInvoiceNumber: Signal<string | undefined>;
	public vendorInvoiceDate: Signal<string | undefined>;

	constructor(dto?: Partial<PurchaseInvoiceDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, mode);
		this.type = this.assign("type", dto?.type ?? PurchaseInvoiceType.Bill);
		this.originalPurchaseInvoiceId = this.assign("originalPurchaseInvoiceId", dto?.originalPurchaseInvoiceId);
		this.goodsReceiptNoteId = this.assign("goodsReceiptNoteId", dto?.goodsReceiptNoteId);
		this.vendorInvoiceNumber = this.assign("vendorInvoiceNumber", dto?.vendorInvoiceNumber);
		this.vendorInvoiceDate = this.assign("vendorInvoiceDate", dto?.vendorInvoiceDate);

		this.partnerId.value = dto?.partnerId ?? (Services.auth.setting?.defaultSupplierPartnerId.value || 0);
		this.partnerName.value = dto?.partnerName ?? Services.auth.setting?.defaultSupplierPartnerName.value;

		this.items = this.assign(
			"items",
			(dto?.items ?? []).map((x) =>
			{
				const item = mode === ChangeableEntityMode.Update ? PurchaseInvoiceItem.load(x) : PurchaseInvoiceItem.create(x);
				item.getDocument = () => this;
				return item;
			})
		);
	}

	protected override getInitialVoucherType(): VoucherType
	{
		return this.type.value === PurchaseInvoiceType.CreditNote ? VoucherType.Receipt : VoucherType.Payment;
	}

	protected override assignVoucherDocumentId(voucher: Voucher): void
	{
		voucher.purchaseInvoiceId.value = this.id.value;
	}

	protected override createLineFromItem(
		storeItem: ItemDto,
		selectedUoMId?: number,
		selectedPricingMethodId?: number
	): PurchaseInvoiceItem
	{
		return PurchaseInvoiceItem.createFromItem(this, storeItem, selectedUoMId, selectedPricingMethodId);
	}
}