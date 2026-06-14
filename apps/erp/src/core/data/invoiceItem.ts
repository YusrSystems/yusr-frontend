import {ChangeableEntity, Dto} from "yusr-ui";
import {ItemUnitPricingMethod, type ItemUnitPricingMethodDto} from "@/core/data/itemUnitPricingMethod.ts";
import type {Signal} from "@preact/signals-react";

export class InvoiceItemDto extends Dto {
    public index!: number;
    public invoiceId!: number;
    public itemId!: number;
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

export class InvoiceItem extends ChangeableEntity<InvoiceItemDto> {
    public index: Signal<number>;
    public invoiceId: Signal<number>;
    public itemId: Signal<number | undefined>;
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
    public itemUnitPricingMethods: Signal<ItemUnitPricingMethodDto[]>;

    constructor(dto?: Partial<InvoiceItemDto>) {
        super(dto, []);

        this.index = this.assign("index", dto?.index ?? 0);
        this.invoiceId = this.assign("invoiceId", dto?.invoiceId ?? 0);
        this.itemId = this.assign("itemId", dto?.itemId);
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
}