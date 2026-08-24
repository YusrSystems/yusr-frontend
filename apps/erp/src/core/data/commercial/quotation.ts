import { ChangeableEntityMode, DateService, StorageFile } from "yusr-ui";
import { type Signal } from "@preact/signals-react";
import { ItemDto, ItemType } from "@/core/data/item";
import { Services } from "@/core/services/services";
import { QuotationStatus } from "@/core/types/commercialEnums";
import { CommercialDocument, type ICommercialDocumentDto } from "./commercialDocument";
import { CommercialItem, type ICommercialItemDto } from "./commercialItem";
import type { ItemUoMDto } from "@/core/data/itemUoM";


export class QuotationItemDto implements ICommercialItemDto
{
	public id!: number;
	public index!: number;
	public quotationId!: number;
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

export class QuotationDto implements ICommercialDocumentDto
{
	public id!: number;
	public date!: string;
	public expiryDate?: string;
	public deliveryDate?: string;
	public delegateEmp?: string;
	public fullAmount!: number;
	public settlementReason?: string;
	public settlementAmount!: number;
	public settlementPercent!: number;
	public status!: QuotationStatus;
	public convertedInvoiceId?: number;
	public storeId!: number;
	public partnerId!: number;
	public notes?: string;
	public policy?: string;
	public createdAt!: string | Date;
	public createdBy!: number;
	public updatedAt!: string | Date;
	public updatedBy!: number;
	public rowVer!: number;
	public partnerName?: string;
	public storeName?: string;
	public items: QuotationItemDto[] = [];
	public files: StorageFile[] = [];
}

export class QuotationItem extends CommercialItem<QuotationItemDto, Quotation>
{
	public quotationId: Signal<number>;

	constructor(dto?: Partial<QuotationItemDto>)
	{
		super(dto, ChangeableEntityMode.Create);
		this.quotationId = this.assign("quotationId", dto?.quotationId ?? 0);
	}

	public static createFromItem(
		quotation: Quotation,
		item: ItemDto,
		selectedUoMId?: number,
		selectedPricingMethodId?: number
	): QuotationItem
	{
		const dto = CommercialItem.buildLineDto<QuotationItemDto>({
			doc: quotation,
			item,
			index: quotation.items.value?.length ?? 0,
			selectedUoMId,
			selectedPricingMethodId,
			resolveQuantity: () => 1
		});

		dto.quotationId = quotation.id.value;
		const line = new QuotationItem(dto);
		line.quantityMultiplier.value = dto.uoMDtos.find((u) => u.id === dto.itemUoMId)?.quantityMultiplier ?? 1;
		line.getDocument = () => quotation;
		return line;
	}
}

export class Quotation extends CommercialDocument<QuotationDto, QuotationItem, QuotationItemDto>
{
	public expiryDate: Signal<string | undefined>;
	public deliveryDate: Signal<string | undefined>;
	public delegateEmp: Signal<string | undefined>;
	public status: Signal<QuotationStatus>;
	public convertedInvoiceId: Signal<number | undefined>;

	public override get isDisabled(): boolean
	{
		return this.status.value === QuotationStatus.Converted || this.status.value === QuotationStatus.Cancelled;
	}

	constructor(dto?: Partial<QuotationDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, mode);
		this.expiryDate = this.assign("expiryDate", dto?.expiryDate);
		this.deliveryDate = this.assign("deliveryDate", dto?.deliveryDate);
		this.delegateEmp = this.assign("delegateEmp", dto?.delegateEmp);
		this.status = this.assign("status", dto?.status ?? QuotationStatus.Active);
		this.convertedInvoiceId = this.assign("convertedInvoiceId", dto?.convertedInvoiceId);

		this.partnerId.value = dto?.partnerId ?? (Services.auth.setting?.defaultCustomerPartnerId.value || 0);
		this.partnerName.value = dto?.partnerName ?? Services.auth.setting?.defaultCustomerPartnerName.value;
		this.policy.value = dto?.policy ?? Services.auth.setting?.quotationInvoicePolicy?.value;

		this.items = this.assign(
			"items",
			(dto?.items ?? []).map((x) =>
			{
				const item = mode === ChangeableEntityMode.Update ? QuotationItem.load(x) : QuotationItem.create(x);
				item.getDocument = () => this;
				return item;
			})
		);

		const checkChildren = () =>
		{
			this.hasChanges.value = this.items.value.some((t) => t.hasChanges.value);
		};
		this.items.value.forEach((s) => s.hasChanges.subscribe(checkChildren));
	}

	public static createCopy(source: QuotationDto): Quotation
	{
		const draft: Partial<QuotationDto> = {
			...source,
			id: 0,
			date: DateService.formatDateOnly(new Date()),
			status: QuotationStatus.Active,
			items: (source.items || []).map((qi, idx) => ({
				...qi,
				id: 0,
				index: idx,
				quotationId: 0
			})),
			files: []
		};

		return Quotation.create(draft);
	}

	public loadFromCopy(source: QuotationDto): void
	{
		this.copyFromDocument(source);
		this.expiryDate.value = source.expiryDate;
		this.deliveryDate.value = source.deliveryDate;
		this.delegateEmp.value = source.delegateEmp;
		this.status.value = QuotationStatus.Active;
		this.convertedInvoiceId.value = undefined;

		this.items.value = (source.items || []).map((qi, idx) =>
		{
			const line = new QuotationItem({
				...qi,
				id: 0,
				index: idx,
				quotationId: 0
			});
			line.quantityMultiplier.value = qi.uoMDtos?.find((u) => u.id === qi.itemUoMId)?.quantityMultiplier ?? 1;
			line.getDocument = () => this;
			return line;
		});

		this.syncTotals();
	}

	protected override createLineFromItem(
		storeItem: ItemDto,
		selectedUoMId?: number,
		selectedPricingMethodId?: number
	): QuotationItem
	{
		return QuotationItem.createFromItem(this, storeItem, selectedUoMId, selectedPricingMethodId);
	}
}