import { GripVertical, Trash2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ColumnDef, ColumnVisibilityToggle, NumberField, SelectField, SystemPermissions, SystemPermissionsActions, TextAreaField, useColumnVisibility } from "yusr-ui";
import { SystemPermissionsResources } from "../../../../core/auth/systemPermissionsResources";
import { InvoiceType } from "../../../../core/data/invoice";
import { useInvoiceContext } from "../../logic/invoiceContext";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import { ItemProfitDialog } from "../profit/ItemProfitDialog";
import EmptyTable from "./emptyTable";
import type { DragState } from "./invoiceTableTypes";

export default function InvoiceItemsTable()
{
  const { t } = useTranslation("accounting");
  const {
    mode,
    formData,
    errors,
    slice,
    authState,
    dispatch,
    disabled
  } = useInvoiceContext();

  const hasSettlementPerm = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.InvoiceAddSettlement,
    SystemPermissionsActions.Get
  );

  const hasBarcodePerm = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.InvoiceShowItemProfit,
    SystemPermissionsActions.Get
  );

  const showProfit = hasBarcodePerm
    && (formData.type === InvoiceType.Sell || formData.type === InvoiceType.Quotation);

  const COLUMNS: ColumnDef[] = [
    { key: "cost", label: t("invoices.cost") },
    { key: "priceWithoutTax", label: t("invoices.priceWithoutTax") },
    { key: "taxPercentage", label: t("invoices.taxPercentage") },
    ...(hasSettlementPerm ? [{ key: "settlement", label: t("invoices.settlement") }] : []),
    { key: "finalCost", label: t("invoices.finalCost") },
    { key: "finalPriceWithoutTax", label: t("invoices.finalPriceWithoutTax") }
  ];

  const { visible, toggle, isVisible } = useColumnVisibility(
    "invoice_columns",
    COLUMNS.map((c) => c.key)
  );

  const getMaxAllowedQuantity = (qtn: number) =>
  {
    if (mode === "return")
    {
      return qtn;
    }
    if (formData.type !== InvoiceType.Sell && formData.type !== InvoiceType.Quotation)
    {
      return Number.MAX_SAFE_INTEGER;
    }

    return SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity,
        SystemPermissionsActions.Get
      )
      ? Number.MAX_SAFE_INTEGER
      : qtn;
  };

  const getMinAllowedTaxInclusivePrice = (originaltaxInclusivePrice: number) =>
  {
    if (formData.type !== InvoiceType.Sell && formData.type !== InvoiceType.Quotation)
    {
      return 0;
    }

    return SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.InvoiceSellBelowSellingPrice,
        SystemPermissionsActions.Get
      )
      ? 0
      : originaltaxInclusivePrice;
  };

  // Move Hooks BEFORE the early return to comply with the Rules of Hooks
  const [dragState, setDragState] = useState<DragState>({ draggedIndex: null, dragOverIndex: null });

  const handleDragStart = useCallback((index: number) =>
  {
    setDragState({ draggedIndex: index, dragOverIndex: null });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) =>
  {
    e.preventDefault(); // required to allow the drop
    setDragState((prev) => prev.dragOverIndex === index ? prev : { ...prev, dragOverIndex: index });
  }, []);

  const handleDrop = useCallback(
    (reorderedItems: any[]) =>
    {
      dispatch(slice.formActions.reorderItems(reorderedItems));
      setDragState({ draggedIndex: null, dragOverIndex: null });
    },
    [dispatch, slice]
  );

  const handleDragEnd = useCallback(() =>
  {
    // Runs when drag is cancelled (e.g. Escape key) without a valid drop
    setDragState({ draggedIndex: null, dragOverIndex: null });
  }, []);

  if (formData.invoiceItems?.length === 0)
  {
    return <EmptyTable />;
  }

  const fixedColCount = 7; // drag handler + number + item + pricingMethod + quantity + price + totalPrice
  const actionColCount = (showProfit ? 1 : 0) + 1; // profit + delete
  const visibleCount = COLUMNS.filter((c) => isVisible(c.key)).length;
  const totalColSpan = fixedColCount + visibleCount + actionColCount;

  const handleRowDrop = () =>
  {
    const { draggedIndex, dragOverIndex } = dragState;

    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex)
    {
      return;
    }

    const items = [...(formData.invoiceItems ?? [])];
    const [removed] = items.splice(draggedIndex, 1);
    items.splice(dragOverIndex, 0, removed);

    handleDrop(items);
  };

  return (
    <div className="w-full border border-border rounded-lg shadow-sm bg-background">
      <div className="flex justify-end p-2 border-b border-border">
        <ColumnVisibilityToggle columns={ COLUMNS } visible={ visible } toggle={ toggle } />
      </div>

      <div className="max-h-100 overflow-y-auto overflow-x-auto">
        <table className="relative w-full text-sm text-right">
          <thead className="sticky top-0 bg-muted z-50 border-b border-border">
            <tr>
              <th className="p-3 w-5" /> { /* drag handle spacer */ }
              <th className="p-3 font-semibold w-16 text-muted-foreground">{ t("invoices.number") }</th>
              <th className="p-3 font-semibold text-start w-40">{ t("invoices.item") }</th>
              <th className="p-3 font-semibold text-start w-20 min-w-20">{ t("invoices.pricingMethod") }</th>
              { isVisible("cost") && (
                <th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.cost") }</th>
              ) }
              <th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.quantity") }</th>
              { isVisible("priceWithoutTax") && (
                <th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceWithoutTax") }</th>
              ) }
              { isVisible("taxPercentage") && (
                <th className="p-3 font-semibold text-start w-18 min-w-18">{ t("invoices.taxPercentage") }</th>
              ) }
              <th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceAfterTax") }</th>
              { hasSettlementPerm && isVisible("settlement") && (
                <th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.settlement") }</th>
              ) }
              { isVisible("finalCost") && (
                <th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalCost") }</th>
              ) }
              { isVisible("finalPriceWithoutTax") && (
                <th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithoutTax") }</th>
              ) }
              <th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithTax") }</th>
              { showProfit && <th className="p-4 font-semibold w-3 text-center"></th> }
              <th className="p-4 font-semibold w-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            { formData.invoiceItems?.map((row, index) =>
            {
              const isDragging = dragState.draggedIndex === index;
              const isDraggingOver = dragState.dragOverIndex === index;

              return (
                <React.Fragment key={ `${row.id}-${index}` }>
                  { /* ── Data Row ── */ }
                  <tr
                    draggable={ !disabled }
                    onDragStart={ () => handleDragStart(index) }
                    onDragOver={ (e) => handleDragOver(e, index) }
                    onDrop={ handleRowDrop }
                    onDragEnd={ handleDragEnd }
                    className={ [
                      "border-border last:border-0 transition-colors",
                      isDragging ? "opacity-40" : "hover:bg-muted/20",
                      isDraggingOver ? "border-t-2 border-t-primary" : ""
                    ].join(" ") }
                  >
                    { /* Drag Handle */ }
                    <td className={ `px-2 pt-2 ${disabled ? "invisible" : "cursor-grab active:cursor-grabbing"}` }>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </td>

                    { /* Index */ }
                    <td className="px-2 pt-2 font-bold text-muted-foreground">
                      { index + 1 }
                    </td>

                    { /* Item Name */ }
                    <td className="px-2 pt-2">
                      <div className="font-semibold text-start text-foreground">{ row.itemName }</div>
                    </td>

                    { /* Pricing Method */ }
                    <td className="px-2 pt-2">
                      { (disabled || mode === "return")
                        ? <div className="font-semibold text-foreground">{ row.itemUnitPricingMethodName }</div>
                        : (
                          <SelectField
                            label=""
                            value={ row.itemUnitPricingMethodId?.toString() || "" }
                            onValueChange={ (val: string) =>
                              dispatch(slice.formActions.onInvoiceItemIupmChange({ index, iupmId: Number(val) })) }
                            options={ row.itemUnitPricingMethods?.map((m) => ({
                              label: `${m.pricingMethodName || t("invoices.without")} ${
                                m.unitName || t("invoices.without")
                              }`,
                              value: m.id.toString()
                            })) || [] }
                            placeholder={ t("invoices.selectPricingMethod") }
                            isInvalid={ !!errors[`${row.id}_method`] }
                            disabled={ disabled }
                          />
                        ) }
                    </td>

                    { isVisible("cost") && (
                      <td className="px-2 pt-2">
                        <NumberField disabled label="" value={ row.cost || "0" } />
                      </td>
                    ) }

                    { /* Quantity */ }
                    <td className="px-2 pt-2">
                      <NumberField
                        label=""
                        min={ 0 }
                        step={ 0.1 }
                        max={ getMaxAllowedQuantity(row.originalQuantity) }
                        value={ row.quantity ?? 1 }
                        onChange={ (newValue) =>
                          dispatch(slice.formActions.onInvoiceItemQuantityChange({ index, newQtn: newValue })) }
                        disabled={ mode === "return" ? false : disabled }
                      />
                    </td>

                    { isVisible("priceWithoutTax") && (
                      <td className="px-2 pt-2">
                        <NumberField
                          label=""
                          disabled
                          value={ row.taxExclusivePrice || "0" }
                          onChange={ () =>
                          {} }
                        />
                      </td>
                    ) }

                    { isVisible("taxPercentage") && (
                      <td className="px-2 pt-2">
                        <NumberField label="" value={ row.totalTaxesPerc || "0" } disabled />
                      </td>
                    ) }

                    { /* Price After Tax */ }
                    <td className="px-2 pt-2">
                      <NumberField
                        label=""
                        min={ getMinAllowedTaxInclusivePrice(row.originaltaxInclusivePrice) }
                        value={ row.taxInclusivePrice || "0" }
                        disabled={ disabled || mode === "return" }
                        onChange={ (newVal) =>
                          dispatch(
                            slice.formActions.onInvoiceItemTaxInclusivePriceChange({ index, newPrice: Number(newVal) })
                          ) }
                      />
                    </td>

                    { hasSettlementPerm && isVisible("settlement") && (
                      <td className="px-2 pt-2">
                        <NumberField
                          label=""
                          value={ row.settlement || "0" }
                          disabled={ disabled || mode === "return" }
                          onChange={ (newValue) =>
                            dispatch(
                              slice.formActions.onInvoiceItemSettlementChange({
                                index,
                                newSettlement: Number(newValue),
                                resetInvoiceSettlements: true
                              })
                            ) }
                        />
                      </td>
                    ) }

                    { isVisible("finalCost") && (
                      <td className="px-2 pt-2">
                        <NumberField
                          label=""
                          value={ InvoiceItemsMath.CalcTotalCost(row.cost, row.quantity) || "0" }
                          disabled
                        />
                      </td>
                    ) }

                    { isVisible("finalPriceWithoutTax") && (
                      <td className="px-2 pt-2">
                        <NumberField label="" value={ row.taxExclusiveTotalPrice || "0" } disabled />
                      </td>
                    ) }

                    { /* Final Price with Tax */ }
                    <td className="px-2 pt-2">
                      <NumberField label="" value={ row.taxInclusiveTotalPrice || "0" } disabled />
                    </td>

                    { showProfit && (
                      <td className="px-2 pt-2 text-center">
                        <ItemProfitDialog item={ row } />
                      </td>
                    ) }

                    <td className="px-2 pt-2 text-center">
                      { !disabled && (
                        <button
                          type="button"
                          onClick={ () => dispatch(slice.formActions.removeItem(index)) }
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                          aria-label={ t("invoices.deleteItem") }
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      ) }
                    </td>
                  </tr>

                  { /* ── Notes Row ── */ }
                  <tr
                    className="bg-muted/10 border-b"
                    onDragOver={ (e) => handleDragOver(e, index) }
                    onDrop={ handleRowDrop }
                  >
                    <td colSpan={ totalColSpan } className="px-5 pt-1 pb-3">
                      <TextAreaField
                        collapsible
                        collapsedHeight={ 36 }
                        expandedHeight={ 150 }
                        label=""
                        placeholder={ t("invoices.addDiscription") }
                        value={ row.notes || "" }
                        disabled={ disabled || mode === "return" }
                        onChange={ (val) =>
                          dispatch(slice.formActions.updateItem({
                            index,
                            item: { ...row, notes: typeof val === "string" ? val : val.target.value }
                          })) }
                      />
                    </td>
                  </tr>
                </React.Fragment>
              );
            }) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
