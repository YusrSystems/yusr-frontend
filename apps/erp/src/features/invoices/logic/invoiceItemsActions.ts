import type Item from "@/core/data/item";
import { type PayloadAction } from "@reduxjs/toolkit";
import type { IFormState } from "yusr-ui";
import Invoice, { InvoiceItem } from "../../../core/data/invoice";
import InvoiceItemsMath from "./invoiceItemsMath";

export default class InvoiceItemsActions
{
  public static removeItem(state: IFormState<Invoice>, action: PayloadAction<number>)
  {
    const index = action.payload;
    state.formData.invoiceItems?.splice(index, 1);
    if (state.formData.invoiceItems?.length === 0)
    {
      state.formData.settlementAmount = 0;
      state.formData.settlementPercent = 0;
    }
  }

  public static updateItem(
    state: IFormState<Invoice>,
    action: PayloadAction<{ index: number; item: InvoiceItem; }>
  )
  {
    const item = action.payload.item;
    if (state.formData.invoiceItems != undefined)
    {
      state.formData.invoiceItems[action.payload.index] = item;
    }
  }

  public static addItem(state: IFormState<Invoice>, action: PayloadAction<Item>)
  {
    const storeItem = action.payload;

    const existingItem = state.formData.invoiceItems?.find((item) => item.itemId === storeItem.id);

    if (existingItem)
    {
      state.formData.invoiceItems = state.formData.invoiceItems?.map((item) =>
        item.itemId === storeItem.id
          ? {
            ...item,
            quantity: item.quantity + 1,
            taxExclusiveTotalPrice: item.taxExclusiveTotalPrice + item.taxExclusivePrice,
            taxInclusiveTotalPrice: item.taxInclusiveTotalPrice + item.taxInclusivePrice
          }
          : item
      );

      return;
    }

    const defaultPricingMethod = storeItem.itemUnitPricingMethods?.find((p) => p.unitId === storeItem.sellUnitId)
      || storeItem.itemUnitPricingMethods?.[0];

    const { taxExclusivePrice, taxInclusivePrice } = InvoiceItemsMath.GetPrices(
      storeItem.taxIncluded,
      defaultPricingMethod?.price || 0,
      storeItem.totalTaxes || 0
    );

    state.formData.invoiceItems?.push({
      id: 0,
      index: (state.formData.invoiceItems?.length ?? -1) + 1,
      invoiceId: 0,
      itemId: storeItem.id!,
      itemName: storeItem.name,

      // Pricing Method Details
      itemUnitPricingMethodId: defaultPricingMethod?.id || 0,
      itemUnitPricingMethodName: defaultPricingMethod?.itemUnitPricingMethodName || "",
      itemUnitPricingMethods: storeItem.itemUnitPricingMethods || [],

      // Financials
      quantity: 1,
      originalQuantity: storeItem.storeQuantity || 0,
      originalCost: storeItem.cost || 0,
      cost: (storeItem.cost || 0) * defaultPricingMethod.quantityMultiplier,
      taxExclusivePrice: taxExclusivePrice,
      taxInclusivePrice: taxInclusivePrice,
      originaltaxInclusivePrice: taxInclusivePrice,
      settlement: state.formData.settlementAmount || 0,
      taxExclusiveTotalPrice: taxExclusivePrice,
      taxInclusiveTotalPrice: taxInclusivePrice,

      // Taxes
      taxable: storeItem.taxable || false,
      taxIncluded: storeItem.taxIncluded || false,
      totalTaxesPerc: storeItem.totalTaxes || 0,

      // Misc
      notes: storeItem.description
    });

    if (state.formData.settlementPercent != undefined && state.formData.settlementPercent !== 0)
    {
      InvoiceItemsActions.onInvoiceSettlementPercentChange(state, {
        payload: state.formData.settlementPercent,
        type: "onInvoiceSettlementPercentChange"
      });
    }

    if (state.formData.settlementAmount != undefined && state.formData.settlementAmount !== 0)
    {
      InvoiceItemsActions.onInvoiceSettlementAmountChange(state, {
        payload: state.formData.settlementAmount,
        type: "onInvoiceSettlementAmountChange"
      });
    }
  }

  public static onInvoiceItemIupmChange(
    state: IFormState<Invoice>,
    action: PayloadAction<{ index: number; iupmId: number; }>
  )
  {
    if (state.formData.invoiceItems == undefined)
    {
      return;
    }

    const { index, iupmId } = action.payload;
    let row = state.formData.invoiceItems[index];
    const selectedMethod = row.itemUnitPricingMethods?.find((p) => p.id === iupmId);
    const { taxExclusivePrice, taxInclusivePrice } = InvoiceItemsMath.GetPrices(
      row.taxIncluded,
      selectedMethod?.price || 0,
      row.totalTaxesPerc || 0
    );

    row.itemUnitPricingMethodId = iupmId;
    row.itemUnitPricingMethodName = selectedMethod?.itemUnitPricingMethodName || "";
    row.cost = (row.originalCost || 0) * (selectedMethod?.quantityMultiplier ?? 0);
    row.taxExclusivePrice = taxExclusivePrice;
    row.taxInclusivePrice = taxInclusivePrice;
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );

    if (state.formData.settlementPercent != undefined && state.formData.settlementPercent !== 0)
    {
      InvoiceItemsActions.onInvoiceSettlementPercentChange(state, {
        payload: state.formData.settlementPercent,
        type: "onInvoiceSettlementPercentChange"
      });
    }

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemQuantityChange(
    state: IFormState<Invoice>,
    action: PayloadAction<{ index: number; newQtn: number | undefined; }>
  )
  {
    if (action.payload.newQtn == undefined || state.formData.invoiceItems == undefined)
    {
      return;
    }
    const { index, newQtn } = action.payload;
    let row = state.formData.invoiceItems[index];
    row.quantity = newQtn!;
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemSettlementChange(
    state: IFormState<Invoice>,
    action: PayloadAction<{ index: number; newSettlement: number | undefined; resetInvoiceSettlements: boolean; }>
  )
  {
    if (action.payload.newSettlement == undefined || state.formData.invoiceItems == undefined)
    {
      return;
    }
    const { index, newSettlement } = action.payload;
    let row = state.formData.invoiceItems[index];
    row.settlement = newSettlement || 0;
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );
    if (action.payload.resetInvoiceSettlements)
    {
      state.formData.settlementAmount = 0;
      state.formData.settlementPercent = 0;
    }
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemTaxInclusivePriceChange(
    state: IFormState<Invoice>,
    action: PayloadAction<{ index: number; newPrice: number | undefined; }>
  )
  {
    if (action.payload.newPrice == undefined || state.formData.invoiceItems == undefined)
    {
      return;
    }
    const { index, newPrice } = action.payload;
    let row = state.formData.invoiceItems[index];
    row.taxInclusivePrice = newPrice!;
    row.taxExclusivePrice = InvoiceItemsMath.CalcTaxExclusivePrice(newPrice!, row.totalTaxesPerc);
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );

    if (state.formData.settlementPercent != undefined && state.formData.settlementPercent !== 0)
    {
      InvoiceItemsActions.onInvoiceSettlementPercentChange(state, {
        payload: state.formData.settlementPercent,
        type: "onInvoiceSettlementPercentChange"
      });
    }

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceSettlementAmountChange(state: IFormState<Invoice>, action: PayloadAction<number>)
  {
    state.formData.settlementAmount = action.payload || 0;
    state.formData.settlementPercent = 0;
    state.formData.invoiceItems?.forEach((_, i) =>
      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement: state.formData.settlementAmount, resetInvoiceSettlements: false },
        type: "onInvoiceItemSettlementChange"
      })
    );
  }

  public static onInvoiceSettlementPercentChange(state: IFormState<Invoice>, action: PayloadAction<number>)
  {
    state.formData.settlementPercent = action.payload || 0;
    state.formData.settlementAmount = 0;
    state.formData.invoiceItems?.forEach((item, i) =>
    {
      const newSettlement = Number(
        (item.taxInclusivePrice * ((state.formData.settlementPercent ?? 0) / 100)).toFixed(2)
      );

      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement: newSettlement, resetInvoiceSettlements: false },
        type: "onInvoiceItemSettlementChange"
      });
    });
  }
}
