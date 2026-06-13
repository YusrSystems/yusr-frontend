import type Item from "@/core/data/item";
import type { ItemUnitPricingMethod } from "@/core/data/itemUnitPricingMethod";
import type Stocktaking from "@/core/data/stocktaking";
import type { StocktakingItem } from "@/core/data/stocktakingItem";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { AlertCircle, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, NumberField, SelectField } from "yusr-ui";
import StoreItemSelector from "../items/storeItemSelector";

export interface StocktakingItemsTableProps
{
  entity: Stocktaking;
  createInstance: () => StocktakingItem;
}

export default function StocktakingItemsTable(
  { entity, createInstance }: StocktakingItemsTableProps
)
{
  useSignals();
  const { t } = useTranslation("stocking");

  const groupedItems = (() =>
  {
    const groups = new Map<number, StocktakingItem[]>();
    entity.items?.value.forEach((item) =>
    {
      if (!item.itemId.value)
      {
        return;
      }
      if (!groups.has(item.itemId.value))
      {
        groups.set(item.itemId.value, []);
      }
      groups.get(item.itemId.value)!.push(item);
    });
    return Array.from(groups.values());
  })();

  const getSystemQuantity = (itemId: number) =>
  {
    const existingRow = entity.items?.value.find((i) => i.itemId.value === itemId);
    if (existingRow)
    {
      return existingRow.systemQuantity.value
        * (entity.mode.value === "create" ? 1 : existingRow.quantityMultiplier.value);
    }
    return 0;
  };

  const getAvailableUnits = (itemId: number) =>
  {
    const storeItem = Cubits.items.entities.value.find((si) => si.id.value === itemId);
    const usedUnitIds =
      entity.items?.value.filter((i) => i.itemId.value === itemId).map((i) => i.itemUnitPricingMethodId.value) || [];
    return storeItem?.itemUnitPricingMethods?.value.filter((u) => !usedUnitIds.includes(u.id.value)) || [];
  };

  const getCalculatedActual = (group: StocktakingItem[]) =>
  {
    return group.reduce(
      (sum, item) => sum + ((item.actualQuantity.value || 0) * (item.quantityMultiplier.value || 1)),
      0
    );
  };

  const getVariance = (group: StocktakingItem[]) =>
  {
    const systemQty = getSystemQuantity(group[0]?.itemId.value);
    return getCalculatedActual(group) - systemQty;
  };

  const updateActualQuantity = (item: StocktakingItem, newQty: number | undefined) =>
  {
    if (newQty === undefined || newQty === null)
    {
      return;
    }

    const list = [...(entity.items.value || [])];
    const index = list.findIndex((i) =>
      i.itemId.value === item.itemId.value && i.itemUnitPricingMethodId.value === item.itemUnitPricingMethodId.value
    );
    if (index !== -1)
    {
      list[index].actualQuantity.value = newQty;
      const group = list.filter((i) => i.itemId.value === item.itemId.value);
      list[index].variance.value = getCalculatedActual(group) - getSystemQuantity(item.itemId.value);
      entity.items.value = list;
    }
  };

  const removeUnit = (item: StocktakingItem) =>
  {
    const list = entity.items?.value.filter((i) =>
      !(i.itemId.value === item.itemId.value
        && i.itemUnitPricingMethodId.value === item.itemUnitPricingMethodId.value)
    ) || [];
    entity.items.value = list;
  };

  const removeEntireItem = (itemId: number) =>
  {
    const list = entity.items?.value.filter((i) => i.itemId.value !== itemId) || [];
    entity.items.value = list;
  };

  const addUnitToItem = (itemId: number, unitId: number | undefined) =>
  {
    const storeItem = Cubits.items.entities.value.find((si) => si.id.value === itemId);
    const unitDetails = storeItem?.itemUnitPricingMethods?.value.find((u) => u.id.value === unitId);

    if (!storeItem || !unitDetails)
    {
      return;
    }

    const systemQty = getSystemQuantity(itemId);

    const newItem = createInstance();
    newItem.itemId.value = storeItem.id.value;
    newItem.itemName.value = storeItem.name.value;
    newItem.itemUnitPricingMethodId.value = unitDetails.id.value;
    newItem.itemUnitPricingMethodName.value = unitDetails.itemUnitPricingMethodName.value;
    newItem.quantityMultiplier.value = unitDetails.quantityMultiplier.value;
    newItem.systemQuantity.value = systemQty;
    newItem.actualQuantity.value = 0;
    newItem.variance.value = -systemQty;

    entity.items.value = [...entity.items.value, newItem];
  };

  const handleStoreItemSelect = (item: Item, selectedIupm?: ItemUnitPricingMethod) =>
  {
    const unit = selectedIupm || item.itemUnitPricingMethods?.value[0];

    const list = [...(entity.items.value || [])];
    const existingIndex = list.findIndex(
      (i) => i.itemId.value === item.id.value && i.itemUnitPricingMethodId.value === unit.id.value
    );

    if (existingIndex !== -1)
    {
      const currentQty = list[existingIndex].actualQuantity.value || 0;
      list[existingIndex].actualQuantity.value = currentQty + 1;
      const group = list.filter((i) => i.itemId.value === item.id.value);
      list[existingIndex].variance.value = getCalculatedActual(group) - getSystemQuantity(item.id.value);
      entity.items.value = list;
    }
    else
    {
      // Brand new item — fall back to live store quantity
      const systemQty = item.storeQuantity.value || 0;
      const initialActualQty = selectedIupm ? 1 : 0;

      const newItem = createInstance();
      newItem.itemId = item.id;
      newItem.itemName = item.name;
      newItem.itemUnitPricingMethodId = unit.id;
      newItem.itemUnitPricingMethodName = unit.itemUnitPricingMethodName;
      newItem.quantityMultiplier = unit.quantityMultiplier;
      newItem.systemQuantity.value = systemQty;
      newItem.actualQuantity.value = initialActualQty;
      newItem.variance.value = (initialActualQty * unit.quantityMultiplier.value) - systemQty;

      entity.items.value = [...list, newItem];
    }
  };

  if (!entity.storeId.value)
  {
    return;
  }

  return (
    <div>
      <div className="sticky top-0 z-10 pt-4 pb-2 bg-background">
        { entity.mode.value === "create" && (
          <StoreItemSelector
            storeId={ entity.storeId }
            onSelect={ handleStoreItemSelect }
          />
        ) }
      </div>

      { entity.items.value && entity.items.value.length > 0
        ? (
          <div className="bg-background rounded-lg border overflow-hidden">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3 w-1/4 text-start">{ t("stocktakings.item") }</th>
                  <th className="p-3 w-1/4 text-center">{ t("stocktakings.systemQuantity") }</th>
                  <th className="p-3 w-1/6 text-center">{ t("stocktakings.variance") }</th>
                  <th className="p-3 w-1/4">{ t("stocktakings.actualQuantity") }</th>
                  <th className="p-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                { groupedItems.map((group, index) =>
                {
                  const itemId = group[0].itemId.value;
                  const systemQty = getSystemQuantity(itemId);
                  const variance = getVariance(group);
                  const availableUnits = getAvailableUnits(itemId);

                  return (
                    <tr key={ itemId } className="hover:bg-muted/10 transition-colors">
                      <td className="p-3 font-bold text-center align-top pt-5">{ index + 1 }</td>

                      <td className="p-3 align-top pt-5 font-semibold text-start">
                        { group[0].itemName.value }
                      </td>

                      <td className="p-3 align-top pt-5 text-center font-mono">
                        { systemQty }
                      </td>

                      <td className="p-3 align-top pt-5 text-center">
                        <span
                          className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                            variance < 0
                              ? "bg-red-100 text-red-800"
                              : variance > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }` }
                        >
                          { variance > 0 ? `+${variance}` : variance }
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col gap-2">
                          { group.map((item, j) => (
                            <div key={ j } className="flex gap-2 items-center">
                              <div className="bg-muted px-3 py-2 rounded-md text-xs font-medium w-24 truncate text-center border">
                                { item.itemUnitPricingMethodName.value }
                              </div>
                              <div className="flex-1">
                                <NumberField
                                  label=""
                                  value={ item.actualQuantity }
                                  onChange={ (val) => updateActualQuantity(item, val) }
                                  disabled={ entity.mode.value === "update" }
                                />
                              </div>
                              { entity.mode.value === "create" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
                                  onClick={ () => removeUnit(item) }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              ) }
                            </div>
                          )) }

                          { entity.mode.value === "create" && availableUnits.length > 0 && (
                            <div className="mt-1">
                              <SelectField<number>
                                options={ availableUnits.map((iupm) => ({
                                  label: iupm.itemUnitPricingMethodName.value,
                                  value: iupm.id.value
                                })) }
                                onValueChange={ (unitId) => addUnitToItem(itemId, unitId) }
                              />
                            </div>
                          ) }
                        </div>
                      </td>

                      { entity.mode.value === "create" && (
                        <td className="p-3 text-center align-top pt-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-900 hover:bg-red-100"
                            onClick={ () => removeEntireItem(itemId) }
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </td>
                      ) }
                    </tr>
                  );
                }) }
              </tbody>
            </table>
          </div>
        )
        : (
          <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-background/50">
            <p>{ t("stocktakings.noItems") }</p>
            <p className="text-xs mt-1">{ t("stocktakings.noItemsHint") }</p>
            { entity.getError("items").value && (
              <div className="flex items-center gap-1 text-red-500 mt-3 text-sm font-medium bg-red-500/10 px-3 py-1.5 rounded-md">
                <AlertCircle className="h-4 w-4" />
                { entity.getError("items") }
              </div>
            ) }
          </div>
        ) }
    </div>
  );
}
