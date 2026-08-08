import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, SystemPermissionsActions, Validators } from "yusr-ui";
import { signal, type Signal } from "@preact/signals-react";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath.ts";
import { ItemDto, ItemType } from "@/core/data/item.ts";
import type Invoice from "@/core/data/invoices/invoice.ts";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { ItemUoM, type ItemUoMDto } from "@/core/data/itemUoM.ts";
import { InvoiceType } from "@/core/types/invoiceType.ts";


export class InvoiceItemDto extends Dto
{
	public index!: number;
	public invoiceId!: number;
	public itemId!: number;
	public itemType!: ItemType;
	public itemUoMId!: number;
	public pricingMethodId!: number;
	public quantityMultiplier!: number;
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
	public pricingMethodName!: string;
	public uoMDtos: ItemUoMDto[] = [];
}

export class InvoiceItem extends ChangeableEntity<InvoiceItemDto>
{
	public index: Signal<number>;
	public invoiceId: Signal<number>;
	public itemId: Signal<number | undefined>;
	public itemType: Signal<ItemType>;
	public itemUoMId: Signal<number | undefined>;
	public quantityMultiplier: Signal<number>;
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
	public uoMDtos: Signal<ItemUoM[]>;

	public pricingMethodId: Signal<number | undefined>;
	public pricingMethodName: Signal<string | undefined>;
	public lastBuyPrice: Signal<number>;

	constructor(dto?: Partial<InvoiceItemDto>)
	{
		super(dto, [{
			field: "itemUoMId",
			selector: (d) => d.itemUoMId,
			validators: [Validators.min(1)]
		}, {
			field: "quantity",
			selector: (d) => d.quantity,
			validators: [Validators.custom(
				(value: number) => value > 0, i18n.t("validators.min", {min: 0}))]
		}, {
			field: "taxInclusivePrice",
			selector: (d) => d.taxInclusivePrice,
			validators: [Validators.min(0.1)]
		}, {
			field: "notes",
			selector: (d) => d.notes,
			validators: [Validators.optional(Validators.maxLength(1000))]
		}], ChangeableEntityMode.Create);

		this.index = this.assign("index", dto?.index ?? 0);
		this.invoiceId = this.assign("invoiceId", dto?.invoiceId ?? 0);
		this.itemId = this.assign("itemId", dto?.itemId);
		this.itemType = this.assign("itemType", dto?.itemType);
		this.itemUoMId = this.assign("itemUoMId", dto?.itemUoMId);
		this.quantityMultiplier = this.assign("quantityMultiplier", dto?.quantityMultiplier ?? 1);
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
		this.originalQuantity = this.assign("originalQuantity", dto?.originalQuantity ?? 0);
		this.originalCost = this.assign("originalCost", dto?.originalCost ?? 0);
		this.cost = this.assign("cost", dto?.cost ?? 0);
		this.taxExclusivePrice = this.assign("taxExclusivePrice", dto?.taxExclusivePrice ?? 0);
		this.taxInclusivePrice = this.assign("taxInclusivePrice", dto?.taxInclusivePrice ?? 0);
		this.originalTaxInclusivePrice = this.assign("originalTaxInclusivePrice", dto?.originalTaxInclusivePrice ?? 0);
		this.taxExclusiveTotalPrice = this.assign("taxExclusiveTotalPrice", dto?.taxExclusiveTotalPrice ?? 0);
		this.taxInclusiveTotalPrice = this.assign("taxInclusiveTotalPrice", dto?.taxInclusiveTotalPrice ?? 0);
		this.settlement = this.assign("settlement", dto?.settlement ?? 0);
		this.taxable = this.assign("taxable", dto?.taxable ?? true);
		this.taxIncluded = this.assign("taxIncluded", dto?.taxIncluded ?? true);
		this.totalTaxesPerc = this.assign("totalTaxesPerc", dto?.totalTaxesPerc ?? 0);
		this.notes = this.assign("notes", dto?.notes);
		this.itemName = this.assign("itemName", dto?.itemName);
		this.unitName = this.assign("unitName", dto?.unitName);
		this.uoMDtos = this.assign("uoMDtos", (dto?.uoMDtos ?? []).map(x => ItemUoM.create(x)));
		this.pricingMethodId = signal<number | undefined>(dto?.pricingMethodId);
		this.pricingMethodName = signal<string | undefined>(dto?.pricingMethodName);
		this.lastBuyPrice = signal<number>(0);
	}

	public static createFromItem(invoice: Invoice, item: ItemDto, selectedUoMId?: number, selectedPricingMethodId?: number)
	{
		let defaultUoM = selectedUoMId
			? item.uoMs?.find(u => u.id === selectedUoMId)
			: item.uoMs?.find(u => u.unitId === item.sellUnitId);

		if (!defaultUoM && item.uoMs?.length)
		{
			defaultUoM = item.uoMs[0];
		}

		if (!defaultUoM)
		{
			throw new Error("Default packaging unit not found");
		}

		let defaultPriceTier = selectedPricingMethodId
			? defaultUoM.prices?.find(p => p.pricingMethodId === selectedPricingMethodId)
			: defaultUoM.prices?.[0];

		if (!defaultPriceTier && defaultUoM.prices?.length)
		{
			defaultPriceTier = defaultUoM.prices[0];
		}

		const isPurchase = invoice.type.value === InvoiceType.Purchase || invoice.type.value === InvoiceType.PurchaseReturn;

		const storeDetails = item.itemStores?.find(s => s.storeId === invoice.storeId.value);
		const baseCost = storeDetails?.averageCost ?? 0;
		const cost = baseCost * (defaultUoM.quantityMultiplier ?? 1);

		const price = isPurchase
			? (item.lastBuyPrice ?? 0) * (defaultUoM.quantityMultiplier ?? 1)
			: (defaultPriceTier?.price ?? 0);

		const {taxExclusivePrice, taxInclusivePrice} = InvoiceItemsMath.GetPrices(
			item.taxIncluded,
			price,
			item.totalTaxes ?? 0
		);

		const storeQuantity = storeDetails?.quantity ?? 0;
		const multiplier = defaultUoM.quantityMultiplier ?? 1;

		const ii = InvoiceItem.create({
			id: 0,
			index: (invoice.invoiceItems.value?.length ?? -1) + 1,
			invoiceId: 0,
			itemId: item.id,
			itemType: item.type,
			itemName: item.name,

			// UoM Details
			itemUoMId: defaultUoM.id,
			unitName: defaultUoM.unitName,
			uoMDtos: item.uoMs ?? [],

			// Financials
			quantityMultiplier: multiplier,
			quantity: item.type === ItemType.Service ?
				1 : storeQuantity >= multiplier
					? 1 : Services.auth.hasAuth(SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity, SystemPermissionsActions.Get) ? 1 : 0,
			originalQuantity: storeQuantity,
			originalCost: baseCost,
			cost: Number(cost.toFixed(2)),
			taxExclusivePrice: taxExclusivePrice,
			taxInclusivePrice: taxInclusivePrice,
			originalTaxInclusivePrice: taxInclusivePrice,
			settlement: invoice.settlementAmount.value ?? 0,
			taxExclusiveTotalPrice: taxExclusivePrice,
			taxInclusiveTotalPrice: taxInclusivePrice,

			// Taxes
			taxable: item.taxable ?? false,
			taxIncluded: item.taxIncluded ?? false,
			totalTaxesPerc: item.totalTaxes ?? 0,

			// Misc
			notes: item.description
		});

		ii.pricingMethodId.value = defaultPriceTier?.pricingMethodId;
		ii.pricingMethodName.value = defaultPriceTier?.pricingMethodName;
		ii.lastBuyPrice.value = item.lastBuyPrice ?? 0;
		ii.getInvoice = () => invoice;

		return ii;
	}

	public getInvoice: () => Invoice | undefined = () => undefined;

	public incrementQuantity()
	{
		return this.changeQuantity(this.quantity.value + 1);
	}

	public changeQuantity(newQtn: number)
	{
		this.quantity.value = newQtn;
		this.recalculateTotals();

		const invoice = this.getInvoice();
		if (invoice && invoice.settlementAmount.value)
		{
			invoice.changeSettlementAmount(invoice.settlementAmount.value);
		}
	}

	public changeSettlement(newSettlement: number | undefined, resetInvoiceSettlements: boolean = false)
	{
		this.settlement.value = newSettlement ?? 0;
		this.recalculateTotals();

		const invoice = this.getInvoice();
		if (invoice && resetInvoiceSettlements)
		{
			invoice.settlementAmount.value = 0;
			invoice.settlementPercent.value = 0;
		}
	}

	public changeTaxInclusivePrice(taxInclusivePrice: number, taxExclusivePrice?: number)
	{
		this.taxInclusivePrice.value = taxInclusivePrice;
		this.taxExclusivePrice.value = taxExclusivePrice ?? InvoiceItemsMath.CalcTaxExclusivePrice(taxInclusivePrice, this.totalTaxesPerc.value);
		this.recalculateTotals();

		const invoice = this.getInvoice();

		if (invoice && invoice.settlementPercent.value)
		{
			invoice.changeSettlementPercent(invoice.settlementPercent.value);
		}

		if (invoice && invoice.settlementAmount.value)
		{
			invoice.changeSettlementAmount(invoice.settlementAmount.value);
		}
	}

	public changeUoM(uomId: number)
	{
		const selectedUoM = this.uoMDtos.value?.find(u => u.id.value === uomId);
		if (!selectedUoM) return;

		this.itemUoMId.value = selectedUoM.id.value;
		this.unitName.value = selectedUoM.unitName.value;
		this.quantityMultiplier.value = selectedUoM.quantityMultiplier.value;

		const baseCost = this.originalCost.value;
		this.cost.value = Number((baseCost * this.quantityMultiplier.value).toFixed(2));

		const priceTier = selectedUoM.prices.value?.find(p => p.pricingMethodId.value === this.pricingMethodId.value)
			|| selectedUoM.prices.value?.[0];

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

		this.applyPricingMethodPrice();
	}

	public changePricingMethod(pricingMethodId: number, pricingMethodName?: string)
	{
		this.pricingMethodId.value = pricingMethodId;
		if (pricingMethodName) this.pricingMethodName.value = pricingMethodName;
		this.applyPricingMethodPrice();
	}

	private recalculateTotals()
	{
		this.taxExclusiveTotalPrice.value = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
			this.taxExclusivePrice.value,
			this.settlement.value,
			this.quantity.value,
			this.totalTaxesPerc.value
		);
		this.taxInclusiveTotalPrice.value = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
			this.taxInclusivePrice.value,
			this.settlement.value,
			this.quantity.value
		);
	}

	private applyPricingMethodPrice()
	{
		const invoice = this.getInvoice();
		const isPurchase = invoice?.type.value === InvoiceType.Purchase || invoice?.type.value === InvoiceType.PurchaseReturn;

		let price = 0;
		if (isPurchase)
		{
			price = (this.lastBuyPrice.value ?? 0) * (this.quantityMultiplier.value ?? 1);
		}
		else
		{
			const selectedUoM = this.uoMDtos.value?.find(u => u.id.value === this.itemUoMId.value);
			if (!selectedUoM) return;

			const priceTier = selectedUoM.prices.value?.find(p => p.pricingMethodId.value === this.pricingMethodId.value);
			price = priceTier ? priceTier.price.value : 0;
		}

		const {taxExclusivePrice, taxInclusivePrice} = InvoiceItemsMath.GetPrices(
			this.taxIncluded.value,
			price,
			this.totalTaxesPerc.value ?? 0
		);

		this.changeTaxInclusivePrice(taxInclusivePrice, taxExclusivePrice);
	}
}