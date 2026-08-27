import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";
import { type Signal, signal } from "@preact/signals-react";
import { ItemDto, ItemType } from "@/core/data/item";
import { ItemPriceDto } from "@/core/data/itemPrice";
import { ItemUoM, type ItemUoMDto } from "@/core/data/itemUoM";
import { CommercialMath } from "@/features/commercial/logic/commercialMath";
import type { ICommercialDocument } from "./commercialDocument";


export interface ICommercialItemDto extends Dto
{
	index: number;
	itemId: number;
	itemType: ItemType;
	itemUoMId: number;
	pricingMethodId: number;
	quantity: number;
	originalQuantity: number;
	originalCost: number;
	cost: number;
	taxExclusivePrice: number;
	taxInclusivePrice: number;
	originalTaxInclusivePrice: number;
	taxExclusiveTotalPrice: number;
	taxInclusiveTotalPrice: number;
	settlement: number;
	taxable: boolean;
	taxIncluded: boolean;
	totalTaxesPerc: number;
	notes?: string;
	itemName: string;
	unitName: string;
	pricingMethodName?: string;
	uoMDtos: ItemUoMDto[];
}

export interface BuildLineDtoParams
{
	doc: ICommercialDocument;
	item: ItemDto;
	index?: number;
	selectedUoMId?: number;
	selectedPricingMethodId?: number;
	resolvePrice?: (
		item: ItemDto,
		defaultUoM: ItemUoMDto,
		defaultPriceTier: ItemPriceDto | undefined,
		multiplier: number
	) => number;
	resolveQuantity?: (item: ItemDto, storeQuantity: number, multiplier: number) => number;
}

export abstract class CommercialItem<
	TDto extends ICommercialItemDto,
	TDoc extends ICommercialDocument
> extends ChangeableEntity<TDto>
{
	public index: Signal<number>;
	public itemId: Signal<number | undefined>;
	public itemType: Signal<ItemType>;
	public itemUoMId: Signal<number | undefined>;
	public pricingMethodId: Signal<number | undefined>;
	public quantity: Signal<number>;
	public originalQuantity: Signal<number>;
	public originalCost: Signal<number>;
	public cost: Signal<number>;
	public taxExclusivePrice: Signal<number>;
	public taxInclusivePrice: Signal<number>;
	public originalTaxInclusivePrice: Signal<number>;
	public taxExclusiveTotalPrice: Signal<number>;
	public taxInclusiveTotalPrice: Signal<number>;
	public settlement: Signal<number>;
	public taxable: Signal<boolean>;
	public taxIncluded: Signal<boolean>;
	public totalTaxesPerc: Signal<number>;
	public notes: Signal<string | undefined>;
	public itemName: Signal<string | undefined>;
	public unitName: Signal<string | undefined>;
	public pricingMethodName: Signal<string | undefined>;
	public uoMDtos: Signal<ItemUoM[]>;
	public quantityMultiplier: Signal<number>;
	public lastBuyPrice: Signal<number>;

	protected constructor(
		dto?: Partial<TDto>,
		mode: ChangeableEntityMode = ChangeableEntityMode.Create
	)
	{
		super(
			dto,
			[
				{
					field: "itemUoMId",
					selector: (d: Partial<TDto>) => d.itemUoMId,
					validators: [Validators.min(1)]
				},
				{
					field: "quantity",
					selector: (d: Partial<TDto>) => d.quantity,
					validators: [
						Validators.custom((value: number) => value > 0, i18n.t("validators.min", {min: 0}))
					]
				},
				{
					field: "taxInclusivePrice",
					selector: (d: Partial<TDto>) => d.taxInclusivePrice,
					validators: [Validators.min(0)]
				},
				{
					field: "notes",
					selector: (d: Partial<TDto>) => d.notes,
					validators: [Validators.optional(Validators.maxLength(1000))]
				}
			],
			mode
		);

		this.index = this.assign("index", dto?.index ?? 0);
		this.itemId = this.assign("itemId", dto?.itemId);
		this.itemType = this.assign("itemType", dto?.itemType ?? ItemType.Product);
		this.itemUoMId = this.assign("itemUoMId", dto?.itemUoMId);
		this.pricingMethodId = this.assign("pricingMethodId", dto?.pricingMethodId);
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
		this.originalQuantity = this.assign("originalQuantity", dto?.originalQuantity ?? 0);
		this.originalCost = this.assign("originalCost", dto?.originalCost ?? 0);
		this.cost = this.assign("cost", dto?.cost ?? 0);
		this.taxExclusivePrice = this.assign("taxExclusivePrice", dto?.taxExclusivePrice ?? 0);
		this.taxInclusivePrice = this.assign("taxInclusivePrice", dto?.taxInclusivePrice ?? 0);
		this.originalTaxInclusivePrice = this.assign(
			"originalTaxInclusivePrice",
			dto?.originalTaxInclusivePrice ?? 0
		);
		this.taxExclusiveTotalPrice = this.assign(
			"taxExclusiveTotalPrice",
			dto?.taxExclusiveTotalPrice ?? 0
		);
		this.taxInclusiveTotalPrice = this.assign(
			"taxInclusiveTotalPrice",
			dto?.taxInclusiveTotalPrice ?? 0
		);
		this.settlement = this.assign("settlement", dto?.settlement ?? 0);
		this.taxable = this.assign("taxable", dto?.taxable ?? true);
		this.taxIncluded = this.assign("taxIncluded", dto?.taxIncluded ?? true);
		this.totalTaxesPerc = this.assign("totalTaxesPerc", dto?.totalTaxesPerc ?? 0);
		this.notes = this.assign("notes", dto?.notes);
		this.itemName = this.assign("itemName", dto?.itemName);
		this.unitName = this.assign("unitName", dto?.unitName);
		this.pricingMethodName = this.assign("pricingMethodName", dto?.pricingMethodName);
		this.uoMDtos = this.assign(
			"uoMDtos",
			(dto?.uoMDtos ?? []).map((x) => ItemUoM.create(x))
		);
		this.quantityMultiplier = signal<number>(1);
		this.lastBuyPrice = signal<number>(0);
	}

	public static buildLineDto<TResult extends ICommercialItemDto>({
		doc,
		item,
		index,
		selectedUoMId,
		selectedPricingMethodId,
		resolvePrice,
		resolveQuantity
	}: BuildLineDtoParams): TResult
	{
		let defaultUoM = selectedUoMId
			? item.uoMs?.find((u) => u.id === selectedUoMId)
			: item.uoMs?.find((u) => u.unitId === item.sellUnitId);
		if (!defaultUoM && item.uoMs?.length) defaultUoM = item.uoMs[0];
		if (!defaultUoM) throw new Error("Packaging unit not found");

		let defaultPriceTier = selectedPricingMethodId
			? defaultUoM.prices?.find((p) => p.pricingMethodId === selectedPricingMethodId)
			: defaultUoM.prices?.[0];
		if (!defaultPriceTier && defaultUoM.prices?.length) defaultPriceTier = defaultUoM.prices[0];

		const storeDetails = item.itemStores?.find((s) => s.storeId === doc.storeId.value);
		const baseCost = storeDetails?.averageCost ?? 0;
		const multiplier = defaultUoM.quantityMultiplier ?? 1;
		const storeQuantity = storeDetails?.quantity ?? 0;
		const cost = CommercialMath.round2(baseCost * multiplier);

		const price = resolvePrice
			? resolvePrice(item, defaultUoM, defaultPriceTier, multiplier)
			: defaultPriceTier?.price ?? 0;

		const quantity = resolveQuantity
			? resolveQuantity(item, storeQuantity, multiplier)
			: 1;

		const {taxExclusivePrice, taxInclusivePrice} = CommercialMath.getPrices(
			item.taxIncluded,
			price,
			item.totalTaxes ?? 0
		);

		return {
			id: 0,
			index: index ?? 0,
			itemId: item.id,
			itemType: item.type,
			itemName: item.name,
			itemUoMId: defaultUoM.id,
			pricingMethodId: defaultPriceTier?.pricingMethodId ?? 0,
			pricingMethodName: defaultPriceTier?.pricingMethodName,
			unitName: defaultUoM.unitName,
			uoMDtos: item.uoMs ?? [],
			quantity,
			originalQuantity: storeQuantity,
			originalCost: baseCost,
			cost,
			taxExclusivePrice,
			taxInclusivePrice,
			originalTaxInclusivePrice: taxInclusivePrice,
			settlement: 0,
			taxExclusiveTotalPrice: CommercialMath.calcTaxExclusiveTotalPrice(
				taxExclusivePrice,
				0,
				quantity,
				item.totalTaxes ?? 0
			),
			taxInclusiveTotalPrice: CommercialMath.calcTaxInclusiveTotalPrice(
				taxInclusivePrice,
				0,
				quantity
			),
			taxable: item.taxable ?? false,
			taxIncluded: item.taxIncluded ?? false,
			totalTaxesPerc: item.totalTaxes ?? 0,
			notes: item.description
		} as TResult;
	}

	public getDocument: () => TDoc | undefined = () => undefined;

	public incrementQuantity()
	{
		return this.changeQuantity(this.quantity.value + 1);
	}

	public changeQuantity(newQty: number)
	{
		this.quantity.value = newQty;
		this.recalculateTotals();
		const doc = this.getDocument();
		if (doc)
		{
			if (doc.settlementAmount.value)
			{
				doc.changeSettlementAmount(doc.settlementAmount.value);
			}
			else
			{
				doc.syncTotals();
			}
		}
	}

	public changeSettlement(newSettlement: number | undefined, resetDocSettlements: boolean = false)
	{
		this.settlement.value = newSettlement ?? 0;
		this.recalculateTotals();
		const doc = this.getDocument();
		if (doc)
		{
			if (resetDocSettlements)
			{
				doc.settlementAmount.value = 0;
				doc.settlementPercent.value = 0;
			}
			doc.syncTotals();
		}
	}

	public changeTaxInclusivePrice(taxInclusivePrice: number, taxExclusivePrice?: number)
	{
		this.taxInclusivePrice.value = taxInclusivePrice;
		this.taxExclusivePrice.value =
			taxExclusivePrice ??
			CommercialMath.calcTaxExclusivePrice(taxInclusivePrice, this.totalTaxesPerc.value);
		this.recalculateTotals();
		const doc = this.getDocument();
		if (doc)
		{
			if (doc.settlementPercent.value)
			{
				doc.changeSettlementPercent(doc.settlementPercent.value);
			}
			if (doc.settlementAmount.value)
			{
				doc.changeSettlementAmount(doc.settlementAmount.value);
			}
			doc.syncTotals();
		}
	}

	public changeUoM(uomId: number)
	{
		const selectedUoM = this.uoMDtos.value?.find((u) => u.id.value === uomId);
		if (!selectedUoM) return;
		this.itemUoMId.value = selectedUoM.id.value;
		this.unitName.value = selectedUoM.unitName.value;
		this.quantityMultiplier.value = selectedUoM.quantityMultiplier.value;
		const baseCost = this.originalCost.value;
		this.cost.value = CommercialMath.round2(baseCost * this.quantityMultiplier.value);

		const priceTier =
			selectedUoM.prices.value?.find((p) => p.pricingMethodId.value === this.pricingMethodId.value) ||
			selectedUoM.prices.value?.[0];

		if (priceTier)
		{
			this.pricingMethodId.value = priceTier.pricingMethodId.value;
			this.pricingMethodName.value = priceTier.pricingMethodName.value;
		}
		else
		{
			this.pricingMethodId.value = undefined;
			this.pricingMethodName.value = undefined;
		}
		this.applyPricingTier();
	}

	public changePricingMethod(pricingMethodId: number, pricingMethodName?: string)
	{
		this.pricingMethodId.value = pricingMethodId;
		if (pricingMethodName) this.pricingMethodName.value = pricingMethodName;
		this.applyPricingTier();
	}

	public recalculateTotals()
	{
		this.taxExclusiveTotalPrice.value = CommercialMath.calcTaxExclusiveTotalPrice(
			this.taxExclusivePrice.value,
			this.settlement.value,
			this.quantity.value,
			this.totalTaxesPerc.value
		);
		this.taxInclusiveTotalPrice.value = CommercialMath.calcTaxInclusiveTotalPrice(
			this.taxInclusivePrice.value,
			this.settlement.value,
			this.quantity.value
		);
	}

	protected applyPricingTier()
	{
		const selectedUoM = this.uoMDtos.value?.find((u) => u.id.value === this.itemUoMId.value);
		if (!selectedUoM) return;
		const priceTier = selectedUoM.prices.value?.find(
			(p) => p.pricingMethodId.value === this.pricingMethodId.value
		);
		const price = priceTier ? priceTier.price.value : 0;
		const {taxExclusivePrice, taxInclusivePrice} = CommercialMath.getPrices(
			this.taxIncluded.value,
			price,
			this.totalTaxesPerc.value ?? 0
		);
		this.changeTaxInclusivePrice(taxInclusivePrice, taxExclusivePrice);
	}
}