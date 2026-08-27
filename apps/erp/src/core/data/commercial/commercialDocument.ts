import { ChangeableEntity, ChangeableEntityMode, DateService, Dto, i18n, StorageFile, Validators } from "yusr-ui";
import { type Signal } from "@preact/signals-react";
import { ItemDto, ItemType } from "@/core/data/item";
import { CommercialMath } from "@/features/commercial/logic/commercialMath";
import { Services } from "@/core/services/services";
import type { CommercialItem, ICommercialItemDto } from "./commercialItem";


export interface ICommercialDocumentDto extends Dto
{
	date: string;
	fullAmount: number;
	settlementReason?: string;
	settlementAmount: number;
	settlementPercent: number;
	storeId: number;
	partnerId: number;
	notes?: string;
	policy?: string;
	createdAt?: string | Date;
	createdBy?: number;
	updatedAt?: string | Date;
	updatedBy?: number;
	rowVer?: number;
	partnerName?: string;
	storeName?: string;
	files: StorageFile[];
	items: ICommercialItemDto[];
}

export interface ICommercialDocument
{
	settlementAmount: Signal<number>;
	settlementPercent: Signal<number>;
	fullAmount: Signal<number>;
	storeId: Signal<number>;
	partnerId: Signal<number | undefined>;
	isDisabled: boolean;

	changeSettlementPercent(settlementPercent: number): void;

	changeSettlementAmount(settlementAmount: number): void;

	syncTotals(): void;

	syncPaymentVouchers?(): void;
}

export abstract class CommercialDocument<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
> extends ChangeableEntity<TDto> implements ICommercialDocument
{
	public date: Signal<string>;
	public fullAmount: Signal<number>;
	public settlementReason: Signal<string | undefined>;
	public settlementAmount: Signal<number>;
	public settlementPercent: Signal<number>;
	public storeId: Signal<number>;
	public partnerId: Signal<number | undefined>;
	public notes: Signal<string | undefined>;
	public policy: Signal<string | undefined>;
	public createdAt: Signal<string | Date | undefined>;
	public createdBy: Signal<number | undefined>;
	public updatedAt: Signal<string | Date | undefined>;
	public updatedBy: Signal<number | undefined>;
	public rowVer: Signal<number | undefined>;
	public partnerName: Signal<string | undefined>;
	public storeName: Signal<string | undefined>;
	public files: Signal<StorageFile[]>;
	public items: Signal<TItem[]>;

	public abstract get isDisabled(): boolean;

	protected constructor(
		dto: Partial<TDto> | undefined,
		mode: ChangeableEntityMode = ChangeableEntityMode.Create
	)
	{
		super(
			dto,
			[
				{
					field: "date",
					selector: (d: Partial<TDto>) => d.date,
					validators: [Validators.required(i18n.t("accounting:invoices.dateRequired"))]
				},
				{
					field: "storeId",
					selector: (d: Partial<TDto>) => d.storeId,
					validators: [Validators.required(i18n.t("accounting:invoices.storeRequired"))]
				},
				{
					field: "partnerId",
					selector: (d: Partial<TDto>) => d.partnerId,
					validators: [Validators.required("الجهة مطلوبة")]
				},
				{
					field: "items",
					selector: (d: Partial<TDto>) => d.items,
					validators: [Validators.arrayMinLength(1, i18n.t("accounting:invoices.itemsRequired"))]
				},
				{
					field: "files",
					selector: (d: Partial<TDto>) => d.files,
					validators: [Validators.arrayMaxLength(3)]
				}
			],
			mode
		);

		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.fullAmount = this.assign("fullAmount", dto?.fullAmount ?? 0);
		this.settlementReason = this.assign("settlementReason", dto?.settlementReason);
		this.settlementAmount = this.assign("settlementAmount", dto?.settlementAmount ?? 0);
		this.settlementPercent = this.assign("settlementPercent", dto?.settlementPercent ?? 0);
		this.storeId = this.assign(
			"storeId",
			dto?.storeId ?? Services.auth.setting?.mainStoreId.value
		);
		this.storeName = this.assign(
			"storeName",
			dto?.storeName ?? Services.auth.setting?.mainStoreName.value
		);
		this.partnerId = this.assign("partnerId", dto?.partnerId);
		this.partnerName = this.assign("partnerName", dto?.partnerName);
		this.notes = this.assign("notes", dto?.notes);
		this.policy = this.assign("policy", dto?.policy);
		this.createdAt = this.assign("createdAt", dto?.createdAt);
		this.createdBy = this.assign("createdBy", dto?.createdBy);
		this.updatedAt = this.assign("updatedAt", dto?.updatedAt);
		this.updatedBy = this.assign("updatedBy", dto?.updatedBy);
		this.rowVer = this.assign("rowVer", dto?.rowVer);
		this.files = this.assign("files", dto?.files ?? []);
		this.items = this.assign("items", [] as TItem[]);
	}

	public copyFromDocument(source: ICommercialDocumentDto): void
	{
		this.storeId.value = source.storeId;
		this.storeName.value = source.storeName;
		this.partnerId.value = source.partnerId;
		this.partnerName.value = source.partnerName;
		this.notes.value = source.notes;
		this.policy.value = source.policy;
		this.settlementPercent.value = source.settlementPercent;
		this.settlementAmount.value = source.settlementAmount;
		this.settlementReason.value = source.settlementReason;
	}

	public addItem(storeItem: ItemDto, selectedUoMId?: number, selectedPricingMethodId?: number)
	{
		const existingItem = this.items.value?.find(
			(item) =>
				item.itemId.value === storeItem.id &&
				(!selectedUoMId || item.itemUoMId.value === selectedUoMId)
		);
		if (existingItem)
		{
			if (existingItem.itemType.value === ItemType.Service)
			{
				return;
			}
			return existingItem.incrementQuantity();
		}
		const newItem = this.createLineFromItem(storeItem, selectedUoMId, selectedPricingMethodId);
		this.items.value = [...this.items.value, newItem];
		if (this.settlementPercent.value)
		{
			this.changeSettlementPercent(this.settlementPercent.value);
		}
		if (this.settlementAmount.value)
		{
			this.changeSettlementAmount(this.settlementAmount.value);
		}
		this.syncTotals();
	}

	public removeItem(index: number)
	{
		this.items.value = this.items.value.filter((_, i) => i !== index);
		if (this.items.value.length === 0)
		{
			this.settlementAmount.value = 0;
			this.settlementPercent.value = 0;
		}
		else if (this.settlementAmount.value)
		{
			this.changeSettlementAmount(this.settlementAmount.value);
		}
		this.syncTotals();
	}

	public changeSettlementPercent(settlementPercent: number)
	{
		this.settlementPercent.value = settlementPercent;
		this.settlementAmount.value = 0;
		this.applySettlement(settlementPercent);
		this.syncTotals();
	}

	public changeSettlementAmount(settlementAmount: number)
	{
		this.settlementAmount.value = settlementAmount;
		this.settlementPercent.value = 0;
		const basePrice = CommercialMath.calcDocumentBaseTaxInclusivePrice(
			this.items.value.map((i) => ({
				taxExclusivePrice: i.taxExclusivePrice.value,
				taxInclusivePrice: i.taxInclusivePrice.value,
				settlement: 0,
				quantity: i.quantity.value,
				totalTaxesPerc: i.totalTaxesPerc.value
			}))
		);
		const exactPercent = basePrice === 0 ? 0 : (settlementAmount / basePrice) * 100;
		this.applySettlement(exactPercent);

		if (basePrice !== 0 && this.items.value.length > 0)
		{
			const targetDocPrice = CommercialMath.round2(basePrice + settlementAmount);
			const currentDocPrice = CommercialMath.calcDocumentTaxInclusivePrice(
				this.items.value.map((i) => ({
					taxExclusivePrice: i.taxExclusivePrice.value,
					taxInclusivePrice: i.taxInclusivePrice.value,
					settlement: i.settlement.value,
					quantity: i.quantity.value,
					totalTaxesPerc: i.totalTaxesPerc.value
				}))
			);
			const diff = CommercialMath.round2(targetDocPrice - currentDocPrice);
			if (diff !== 0)
			{
				const targetItem = this.items.value.find((i) => i.quantity.value === 1) || this.items.value[0];
				if (targetItem)
				{
					const settlementAdjustment = diff / targetItem.quantity.value;
					targetItem.changeSettlement(
						CommercialMath.round2(targetItem.settlement.value + settlementAdjustment)
					);
				}
			}
		}
		this.syncTotals();
	}

	public syncTotals()
	{
		this.items.value?.forEach((item) => item.recalculateTotals());

		this.fullAmount.value = CommercialMath.calcDocumentTaxInclusivePrice(
			this.items.value.map((i) => ({
				taxExclusivePrice: i.taxExclusivePrice.value,
				taxInclusivePrice: i.taxInclusivePrice.value,
				settlement: i.settlement.value,
				quantity: i.quantity.value,
				totalTaxesPerc: i.totalTaxesPerc.value
			}))
		);
	}

	override validate(dto?: Partial<TDto>): boolean
	{
		this.syncTotals();

		const docValid = super.validate(dto);
		const itemsValid = this.items.value.every((t) => t.validate());
		return docValid && itemsValid;
	}

	protected abstract createLineFromItem(
		storeItem: ItemDto,
		selectedUoMId?: number,
		selectedPricingMethodId?: number
	): TItem;

	private applySettlement(settlementPercent: number)
	{
		this.items.value?.forEach((item) =>
		{
			const newSettlement = CommercialMath.round2(
				item.taxInclusivePrice.value * (settlementPercent / 100)
			);
			item.changeSettlement(newSettlement);
		});
	}
}