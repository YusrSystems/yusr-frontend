import { AlertCircle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn, type DialogMode, InputFieldOld, SelectFieldOld } from "yusr-ui";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { ItemTransferActions } from "./logic/itemTransferActions";
import type { TransferRowItem } from "./logic/itemTransferSlice";

export default function SelectedItemsTable({ mode }: { mode: DialogMode; })
{
  const { t } = useTranslation("stocking");
  const dispatch = useAppDispatch();
  const { items, errors } = useAppSelector((state) => state.itemTransferUI);

  const getAvailableQuantity = (row: TransferRowItem): number =>
  {
    const iupm = row.itemUnitPricingMethods.find((method) => method.id === row.selectedPricingMethodId);
    if (!iupm || iupm.quantityMultiplier === 0)
    {
      return 0;
    }
    return row.maxQuantity / iupm.quantityMultiplier;
  };

  if (items.length === 0)
  {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-background/50">
        <p>{ t("itemTransfers.noItems") }</p>
        <p className="text-xs mt-1">{ t("itemTransfers.noItemsHint") }</p>
        { errors["general"] && (
          <div className="flex items-center gap-1 text-red-500 mt-3 text-sm font-medium bg-red-500/10 px-3 py-1.5 rounded-md">
            <AlertCircle className="h-4 w-4" />
            { errors["general"] }
          </div>
        ) }
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
      <table className="w-full text-sm text-right">
        <thead className="bg-muted/40 border-b border-border">
          <tr>
            <th className="p-4 font-semibold w-16 text-center text-muted-foreground">{ t("itemTransfers.number") }</th>
            <th className="p-4 font-semibold text-start">{ t("itemTransfers.itemName") }</th>
            <th className="p-4 font-semibold text-center w-72">{ t("itemTransfers.pricingMethodAndUnit") }</th>
            <th className="p-4 font-semibold text-center w-40">{ t("itemTransfers.quantity") }</th>
            <th className="p-4 font-semibold w-16 text-center"></th>
          </tr>
        </thead>
        <tbody>
          { items.map((row, index) => (
            <tr
              key={ row.id }
              className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td className="p-4 text-center font-bold text-muted-foreground">{ index + 1 }</td>

              <td className="p-4 text-start">
                <div className="font-semibold text-foreground">{ row.itemName }</div>
                { row.quantity > 0 && row.selectedPricingMethodId && (
                  <div className="text-xs text-muted-foreground mt-1">
                    { t("itemTransfers.available") }: { getAvailableQuantity(row) }
                  </div>
                ) }
              </td>

              <td className="p-4 text-center align-top">
                <SelectFieldOld
                  label=""
                  value={ row.selectedPricingMethodId?.toString() || "" }
                  onValueChange={ (val) => ItemTransferActions.updatePricingMethod(dispatch, row.id, Number(val)) }
                  options={ row.itemUnitPricingMethods?.map((m) => ({
                    label: `${m.pricingMethodName || t("itemTransfers.without")} - ${
                      m.unitName || t("itemTransfers.without")
                    }`,
                    value: m.id.toString()
                  })) || [] }
                  placeholder={ t("itemTransfers.selectPricingMethod") }
                  isInvalid={ !!errors[`${row.id}_method`] }
                  disabled={ mode === "update" }
                />
                { errors[`${row.id}_method`] && (
                  <span className="text-xs text-red-500 mt-1 block animate-in fade-in">
                    { errors[`${row.id}_method`] }
                  </span>
                ) }
              </td>

              <td className="p-4 text-center align-top">
                <div className="flex flex-col items-center justify-center gap-1">
                  <InputFieldOld
                    label=""
                    min={ 1 }
                    value={ row.quantity || "" }
                    onChange={ (e) => ItemTransferActions.updateQuantity(dispatch, row.id, Number(e.target.value)) }
                    disabled={ mode === "update" }
                    className={ cn(
                      "flex w-full rounded-md border bg-background px-3 py-2 text-sm text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors",
                      errors[row.id] ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    ) }
                  />
                  { errors[row.id] && (
                    <span className="text-xs text-red-500 animate-in fade-in text-center">
                      { errors[row.id] }
                    </span>
                  ) }
                </div>
              </td>

              <td className="p-4 text-center align-top pt-5">
                { mode === "create" && (
                  <button
                    type="button"
                    onClick={ () => ItemTransferActions.removeItem(dispatch, row.id) }
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                    aria-label={ t("itemTransfers.deleteItem") }
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                ) }
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  );
}
