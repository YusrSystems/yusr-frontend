import { Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { NumberField, SelectField, SystemPermissions, SystemPermissionsActions, TextField } from "yusr-ui";
import { SystemPermissionsResources } from "../../../../core/auth/systemPermissionsResources";
import { InvoiceType } from "../../../../core/data/invoice";
import { useInvoiceContext } from "../../logic/invoiceContext";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import { ItemProfitDialog } from "../profit/ItemProfitDialog";
import EmptyTable from "./emptyTable";

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

  const getMaxAllowedQuantity = (qtn: number) =>
  {
    if (formData.type !== InvoiceType.Sell && formData.type !== InvoiceType.Quotation)
    {
      return Number.MAX_SAFE_INTEGER;
    }

    if (mode === "return")
    {
      return qtn;
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

  if (formData.invoiceItems?.length === 0)
  {
    return <EmptyTable />;
  }
  return (
    <div className="w-full border border-border rounded-lg shadow-sm bg-background">
      <div className="max-h-100 overflow-y-auto overflow-x-auto">
        <table className="relative w-full text-sm text-right">
          <thead className="sticky top-0 bg-muted z-50 border-b border-border">
            <tr>
              <th className="p-3 font-semibold w-16 text-center text-muted-foreground">{ t("invoices.number") }</th>
              <th className="p-3 font-semibold text-start w-40 ">{ t("invoices.item") }</th>
              <th className="p-3 font-semibold text-start w-20 min-w-20">{ t("invoices.pricingMethod") }</th>
              <th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.cost") }</th>
              <th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.quantity") }</th>
              <th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceWithoutTax") }</th>
              <th className="p-3 font-semibold text-start w-18 min-w-18">{ t("invoices.taxPercentage") }</th>
              <th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceAfterTax") }</th>
              { SystemPermissions.hasAuth(
                authState.loggedInUser?.role?.permissions ?? [],
                SystemPermissionsResources.InvoiceAddSettlement,
                SystemPermissionsActions.Get
              ) && <th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.settlement") }</th> }

              <th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalCost") }</th>
              <th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithoutTax") }</th>
              <th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithTax") }</th>
              { SystemPermissions.hasAuth(
                authState.loggedInUser?.role?.permissions ?? [],
                SystemPermissionsResources.InvoiceShowItemProfit,
                SystemPermissionsActions.Get
              ) && (formData.type === InvoiceType.Sell || formData.type === InvoiceType.Quotation) && (
                <th className="p-4 font-semibold w-3 text-center"></th>
              ) }

              <th className="p-4 font-semibold w-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            { formData.invoiceItems?.map((row, index) => (
              <React.Fragment key={ row.id }>
                <tr
                  key={ row.id }
                  className="border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-2 pt-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>

                  <td className="px-2 pt-2">
                    <div className="font-semibold text-start text-foreground">{ row.itemName }</div>
                  </td>

                  <td className="px-2 pt-2">
                    { (disabled || mode === "return") && (
                      <div className="font-semibold text-foreground">{ row.itemUnitPricingMethodName }</div>
                    ) }
                    { !(disabled || mode === "return") && (
                      <SelectField
                        label=""
                        value={ row.itemUnitPricingMethodId?.toString() || "" }
                        onValueChange={ (val: string) =>
                          dispatch(slice.formActions.onInvoiceItemIupmChange({ index: index, iupmId: Number(val) })) }
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

                  <td className="px-2 pt-2">
                    <NumberField disabled label="" value={ row.cost || "0" } />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      min={ 0 }
                      step={ 0.1 }
                      max={ getMaxAllowedQuantity(row.originalQuantity) }
                      value={ row.quantity ?? 1 }
                      onChange={ (newValue) =>
                        dispatch(slice.formActions.onInvoiceItemQuantityChange({ index: index, newQtn: newValue })) }
                      disabled={ mode === "return" ? false : disabled }
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      disabled
                      value={ row.taxExclusivePrice || "0" }
                      onChange={ () =>
                      {} }
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      value={ row.totalTaxesPerc || "0" }
                      disabled
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      min={ getMinAllowedTaxInclusivePrice(row.originaltaxInclusivePrice) }
                      value={ row.taxInclusivePrice || "0" }
                      disabled={ disabled || mode === "return" }
                      onChange={ (newVal) =>
                        dispatch(
                          slice.formActions.onInvoiceItemTaxInclusivePriceChange({
                            index: index,
                            newPrice: Number(newVal)
                          })
                        ) }
                    />
                  </td>

                  { SystemPermissions.hasAuth(
                    authState.loggedInUser?.role?.permissions ?? [],
                    SystemPermissionsResources.InvoiceAddSettlement,
                    SystemPermissionsActions.Get
                  ) && (
                    <td className="px-2 pt-2">
                      <NumberField
                        label=""
                        value={ row.settlement || "0" }
                        disabled={ disabled || mode === "return" }
                        onChange={ (newValue) =>
                        {
                          dispatch(
                            slice.formActions.onInvoiceItemSettlementChange({
                              index: index,
                              newSettlement: Number(newValue)
                            })
                          );
                        } }
                      />
                    </td>
                  ) }

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      value={ InvoiceItemsMath.CalcTotalCost(row.cost, row.quantity) || "0" }
                      disabled
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      value={ row.taxExclusiveTotalPrice || "0" }
                      disabled
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      value={ row.taxInclusiveTotalPrice || "0" }
                      disabled
                    />
                  </td>

                  { SystemPermissions.hasAuth(
                    authState.loggedInUser?.role?.permissions ?? [],
                    SystemPermissionsResources.InvoiceShowItemProfit,
                    SystemPermissionsActions.Get
                  ) && (formData.type === InvoiceType.Sell || formData.type === InvoiceType.Quotation) && (
                    <td className="px-2 pt-2">
                      <ItemProfitDialog item={ row } />
                    </td>
                  ) }

                  <td className="px-2 pt-2">
                    { (!disabled)
                      && (
                        <button
                          type="button"
                          onClick={ () =>
                          {
                            dispatch(slice.formActions.removeItem(index));
                          } }
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                          aria-label={ t("invoices.deleteItem") }
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      ) }
                  </td>
                </tr>
                <tr className="bg-muted/10 border-b">
                  <td colSpan={ 14 } className="px-5 pt-1 pb-3">
                    <TextField
                      label=""
                      placeholder={ t("invoices.addNotes") }
                      value={ row.notes || "" }
                      disabled={ disabled || mode === "return" }
                      onChange={ (val) =>
                      {
                        dispatch(
                          slice.formActions.updateItem({
                            index: index,
                            item: { ...row, notes: typeof val === "string" ? val : val.target.value }
                          })
                        );
                      } }
                    />
                  </td>
                </tr>
              </React.Fragment>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
