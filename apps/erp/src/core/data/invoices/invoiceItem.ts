import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, SystemPermissionsActions, Validators } from "yusr-ui";
import { ItemUnitPricingMethod, type ItemUnitPricingMethodDto } from "@/core/data/itemUnitPricingMethod.ts";
import { type Signal } from "@preact/signals-react";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath.ts";
import Item, { ItemType } from "@/core/data/item.ts";
import type Invoice from "@/core/data/invoices/invoice.ts";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";


export class InvoiceItemDto extends Dto
{
	public index!: number;
	public invoiceId!: number;
	public itemId!: number;
	public itemType!: ItemType;
	public itemUnitPricingMethodId!: number;
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
	public itemUnitPricingMethodName!: string;
	public itemUnitPricingMethods: ItemUnitPricingMethodDto[] = [];
}

export class InvoiceItem extends ChangeableEntity<InvoiceItemDto>
{
	public index: Signal<number>;
	public invoiceId: Signal<number>;
	public itemId: Signal<number | undefined>;
	public itemType: Signal<ItemType>;
	public itemUnitPricingMethodId: Signal<number | undefined>;
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
	public itemUnitPricingMethodName: Signal<string | undefined>;
	public itemUnitPricingMethods: Signal<ItemUnitPricingMethod[]>;

	constructor(dto?: Partial<InvoiceItemDto>)
	{
		super(dto, [{
			field: "itemUnitPricingMethodId",
			selector: (d) => d.itemUnitPricingMethodId,
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
		this.itemUnitPricingMethodId = this.assign("itemUnitPricingMethodId", dto?.itemUnitPricingMethodId);
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
		this.itemUnitPricingMethodName = this.assign("itemUnitPricingMethodName", dto?.itemUnitPricingMethodName);
		this.itemUnitPricingMethods = this.assign("itemUnitPricingMethods", (dto?.itemUnitPricingMethods ?? [])
			.map(x => ItemUnitPricingMethod.create(x)));
	}

	public static createFromItem(invoice: Invoice, item: Item)
	{
		const defaultPricingMethod = item.itemUnitPricingMethods.value?.find((p) => p.unitId.value === item.sellUnitId.value)
			?? item.itemUnitPricingMethods.value[0];

		if (!defaultPricingMethod)
		{
			throw new Error("Default pricing method not found");
		}

		const {taxExclusivePrice, taxInclusivePrice} = InvoiceItemsMath.GetPrices(
			item.taxIncluded.value,
			defaultPricingMethod?.price.value ?? 0,
			item.totalTaxes.value ?? 0
		);

		const ii = InvoiceItem.create({
			id: 0,
			index: (invoice.invoiceItems.value?.length ?? -1) + 1,
			invoiceId: 0,
			itemId: item.id.value,
			itemType: item.type.value,
			itemName: item.name.value,

			// Pricing Method Details
			itemUnitPricingMethodId: defaultPricingMethod?.id.value,
			itemUnitPricingMethodName: defaultPricingMethod?.itemUnitPricingMethodName.value,
			itemUnitPricingMethods: (item.itemUnitPricingMethods.value ?? []).map(x => x.toJson()),

			// Financials
			quantity: item.type.value === ItemType.Service ?
				1 : item.storeQuantity.value
					? 1 : Services.auth.hasAuth(SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity, SystemPermissionsActions.Get) ? 1 : 0,
			originalQuantity: item.storeQuantity.value ?? 0,
			originalCost: item.cost.value ?? 0,
			cost: (item.cost.value ? Number((item.cost.value).toFixed(2)) : 0) * defaultPricingMethod.quantityMultiplier.value,
			taxExclusivePrice: taxExclusivePrice,
			taxInclusivePrice: taxInclusivePrice,
			originalTaxInclusivePrice: taxInclusivePrice,
			settlement: invoice.settlementAmount.value ?? 0,
			taxExclusiveTotalPrice: taxExclusivePrice,
			taxInclusiveTotalPrice: taxInclusivePrice,

			// Taxes
			taxable: item.taxable.value ?? false,
			taxIncluded: item.taxIncluded.value ?? false,
			totalTaxesPerc: item.totalTaxes.value ?? 0,

			// Misc
			notes: item.description.value
		});

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

		const invoice = this.getInvoice();
		if (invoice && invoice.settlementAmount.value)
		{
			invoice.changeSettlementAmount(invoice.settlementAmount.value);
		}
	}

	public changeSettlement(newSettlement: number | undefined, resetInvoiceSettlements: boolean = false)
	{

		this.settlement.value = newSettlement ?? 0;
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

		const invoice = this.getInvoice();
		if (invoice && resetInvoiceSettlements)
		{
			invoice.settlementAmount.value = 0;
			invoice.settlementPercent.value = 0;
		}
	}

	public changeTaxInclusivePrice(taxInclusivePrice: number, taxExclusivePrice?: number)
	{
		this.taxInclusivePrice.value = taxInclusivePrice!;
		this.taxExclusivePrice.value = taxExclusivePrice ?? InvoiceItemsMath.CalcTaxExclusivePrice(taxInclusivePrice, this.totalTaxesPerc.value);
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

	public changeIupm(iupmId: number)
	{
		const selectedMethod = this.itemUnitPricingMethods.value?.find((p) => p.id.value === iupmId);

		if (!selectedMethod)
		{
			throw Error("ItemUnitPricingMethod not found");
		}

		const {taxExclusivePrice, taxInclusivePrice} = InvoiceItemsMath.GetPrices(
			this.taxIncluded.value,
			selectedMethod.price.value ?? 0,
			this.totalTaxesPerc.value ?? 0
		);

		this.itemUnitPricingMethodId.value = iupmId;
		this.itemUnitPricingMethodName.value = selectedMethod.itemUnitPricingMethodName.value ?? "";
		this.cost.value = (this.originalCost.value ?? 0) * (selectedMethod.quantityMultiplier.value ?? 0);
		this.changeTaxInclusivePrice(taxInclusivePrice, taxExclusivePrice);
	}
}