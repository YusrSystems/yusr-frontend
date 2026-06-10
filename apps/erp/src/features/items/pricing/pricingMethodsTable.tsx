import PricingMethodsSearchableSelect from "@/core/components/searchableSelect/pricingMethodsSearchableSelect";
import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect";
import type Item from "@/core/data/item";
import { ItemUnitPricingMethod } from "@/core/data/item";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Barcode, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, CurrencyIcon, FormField, NumberField, SystemPermissionsActions, TextField } from "yusr-ui";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import { ItemType } from "../../../core/data/itemOld";
import ItemBarcodeButton from "../../reports/itemBarcodeDialog";

export default function PricingMethodsTable({ entity }: { entity: Item; })
{
  useSignals();
  const { t } = useTranslation("stocking");
  const errorMessage = entity.getError("itemUnitPricingMethods");
  const isService = entity.type.value === ItemType.Service;

  const addPricingMethod = () =>
  {
    const newItem = new ItemUnitPricingMethod({
      id: 0,
      itemId: entity.id.value,
      unitId: undefined,
      itemUnitPricingMethodName: undefined,
      unitName: undefined,
      pricingMethodId: undefined,
      pricingMethodName: undefined,
      quantityMultiplier: 1,
      unitPrice: 0,
      price: 0,
      barcode: ItemUnitPricingMethod.generateBarcode()
    });
    entity.itemUnitPricingMethods.value = [...entity.itemUnitPricingMethods.value, newItem];
  };

  const suggestIUPMName = (index: number) =>
  {
    const suggestName = `${entity.itemUnitPricingMethods.value[index]?.unitName.value || ""} ${
      entity.itemUnitPricingMethods.value[index]?.pricingMethodName.value || ""
    }`;
    entity.itemUnitPricingMethods.value[index].itemUnitPricingMethodName.value = suggestName;
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">{ t("items.pricingMethods") }</h3>
        { !isService && (
          <Button type="button" size="sm" onClick={ addPricingMethod }>
            <Plus className="w-4 h-4 me-2" /> { t("items.addPricingMethod") }
          </Button>
        ) }
      </div>

      <div
        className={ `bg-muted/20 rounded-lg border overflow-hidden overflow-x-auto transition-colors ${
          errorMessage.value ? "border-red-500" : ""
        }` }
      >
        <table className="w-full text-sm text-right min-w-200">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 w-12 text-start">{ t("items.number") }</th>
              <th className="p-3 w-32 text-start">{ t("items.unit") }</th>
              <th className="p-3 w-32 text-start">{ t("items.pricingMethod") }</th>
              <th className="p-3 w-32 text-start">{ t("items.quantityInUnit") }</th>
              <th className="p-3 w-32 text-start">{ t("items.sellingPrice", { unit: entity.sellUnitName.value }) }</th>
              <th className="p-3 w-45 text-start">{ t("items.barcode") }</th>
              <th className="p-3 w-40 text-start">{ t("items.name") }</th>
              { Services.auth.hasAuth(
                SystemPermissionsResources.ReportItemBarcode,
                SystemPermissionsActions.Get
              ) && <th className="p-3 w-12 text-center"></th> }
              { !isService && <th className="p-3 w-12 text-center"></th> }
            </tr>
          </thead>
          <tbody>
            { entity.itemUnitPricingMethods?.value.map((method, index) =>
            {
              return (
                <tr key={ index } className="border-t border-muted">
                  <td className="p-3 font-bold">{ index + 1 }</td>
                  <td className="p-3">
                    <FormField
                      label=""
                      error={ method.getError("unitId") }
                    >
                      <UnitsSearchableSelect
                        id={ method.unitId }
                        label={ method.unitName }
                        disabled={ isService }
                        onSelect={ (unit) =>
                        {
                          if (unit?.id.value === entity.sellUnitId.value)
                          {
                            method.quantityMultiplier.value = 1;
                          }
                          suggestIUPMName(index);
                          entity.clearError("itemUnitPricingMethods");
                        } }
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <FormField
                      label=""
                      error={ method.getError("pricingMethodId") }
                    >
                      <PricingMethodsSearchableSelect
                        id={ entity.itemUnitPricingMethods?.value[index].pricingMethodId }
                        label={ entity.itemUnitPricingMethods?.value[index].pricingMethodName }
                        disabled={ isService }
                        onSelect={ () =>
                        {
                          entity.clearError("itemUnitPricingMethods");
                          suggestIUPMName(index);
                        } }
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      min={ 1 }
                      disabled={ method.unitId.value === entity.sellUnitId.value }
                      value={ method.quantityMultiplier }
                      error={ method.getError("quantityMultiplier") }
                      onChange={ () => entity.clearError("itemUnitPricingMethods") }
                    />
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      min={ 0 }
                      value={ method.unitPrice }
                      onChange={ (val) =>
                      {
                        entity.clearError("itemUnitPricingMethods");
                        const multiplier = method.quantityMultiplier.value && method.quantityMultiplier.value !== 0
                          ? method.quantityMultiplier.value
                          : 1;
                        method.price.value = val ? val * multiplier : 0;
                      } }
                      error={ method.getError("unitPrice") }
                      currency={ <CurrencyIcon /> }
                    />
                  </td>
                  <td className="p-3 flex">
                    <TextField
                      className="rounded-e-none"
                      label=""
                      value={ method.barcode }
                    />
                    <Button type="button" className="rounded-s-none" onClick={ () => method.generateBarcode() }>
                      <Barcode className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="p-3">
                    <TextField
                      label=""
                      value={ method.itemUnitPricingMethodName }
                      error={ method.getError("itemUnitPricingMethodName") }
                    />
                  </td>

                  { Services.auth.hasAuth(
                    SystemPermissionsResources.ReportItemBarcode,
                    SystemPermissionsActions.Get
                  ) && (
                    <td className="p-3 text-center">
                      <ItemBarcodeButton item={ entity } iupm={ method } />
                    </td>
                  ) }

                  { !isService && (
                    <td className="p-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={ () =>
                          entity.itemUnitPricingMethods.value = entity.itemUnitPricingMethods.value.filter((_, i) =>
                            i !== index
                          ) }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  ) }
                </tr>
              );
            }) }
          </tbody>
        </table>
        { entity.itemUnitPricingMethods?.value.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            { t("items.noPricingMethods") }
          </div>
        ) }
      </div>

      { errorMessage.value && (
        <div className="text-xs font-medium text-red-500 mt-2 animate-in fade-in slide-in-from-top-1">
          { errorMessage }
        </div>
      ) }
    </div>
  );
}
