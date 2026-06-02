import PricingMethodsSearchableSelect from "@/core/components/searchableSelect/pricingMethodsSearchableSelect";
import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, CurrencyIcon, FormField, NumberField, SystemPermissions, SystemPermissionsActions, TextFieldOld } from "yusr-ui";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import Item, { ItemType } from "../../../core/data/item";
import { useAppSelector } from "../../../core/state/store";
import ItemBarcodeButton from "../../reports/itemBarcodeDialog";
import usePricingMethodsTable from "./usePricingMethodsTable";

export default function PricingMethodsTable()
{
  const { t } = useTranslation("stocking");
  const {
    formData,
    addPricingMethod,
    updatePricingMethod,
    removePricingMethod,
    isInvalid,
    getError
  } = usePricingMethodsTable();

  const hasError = isInvalid("itemUnitPricingMethods");
  const errorMessage = getError("itemUnitPricingMethods");
  const authState = useAppSelector((state) => state.auth);
  const isService = formData.type === ItemType.Service;

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
          hasError ? "border-red-500" : ""
        }` }
      >
        <table className="w-full text-sm text-right min-w-200">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 w-12 text-start">{ t("items.number") }</th>
              <th className="p-3 w-32 text-start">{ t("items.unit") }</th>
              <th className="p-3 w-40 text-start">{ t("items.pricingMethod") }</th>
              <th className="p-3 w-32 text-start">{ t("items.quantityInUnit") }</th>
              <th className="p-3 w-32 text-start">{ t("items.sellingPrice", { unit: formData.sellUnitName }) }</th>
              <th className="p-3 w-40 text-start">{ t("items.barcode") }</th>
              <th className="p-3 w-40 text-start">{ t("items.name") }</th>
              { SystemPermissions.hasAuth(
                authState.loggedInUser?.role?.permissions ?? [],
                SystemPermissionsResources.ReportItemBarcode,
                SystemPermissionsActions.Get
              ) && <th className="p-3 w-12 text-center"></th> }
              { !isService && <th className="p-3 w-12 text-center"></th> }
            </tr>
          </thead>
          <tbody>
            { formData.itemUnitPricingMethods?.map((method, index) =>
            {
              const multiplier = method.quantityMultiplier && method.quantityMultiplier !== 0
                ? method.quantityMultiplier
                : 1;

              return (
                <tr key={ index } className="border-t border-muted">
                  <td className="p-3 font-bold">{ index + 1 }</td>
                  <td className="p-3">
                    <FormField
                      label=""
                      isInvalid={ hasError && !isService && !method.unitId }
                    >
                      <UnitsSearchableSelect
                        selectedId={ formData.itemUnitPricingMethods?.[index].unitId }
                        selectedLabel={ formData.itemUnitPricingMethods?.[index].unitName }
                        disabled={ isService }
                        isInvalid={ hasError && !isService && !method.unitId }
                        onValueChange={ (unit) =>
                        {
                          updatePricingMethod(index, {
                            unitId: unit?.id,
                            unitName: unit?.name
                          });
                        } }
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <FormField
                      label=""
                      isInvalid={ hasError && !isService && !method.pricingMethodId }
                    >
                      <PricingMethodsSearchableSelect
                        selectedId={ formData.itemUnitPricingMethods?.[index].pricingMethodId }
                        selectedLabel={ formData.itemUnitPricingMethods?.[index].pricingMethodName }
                        disabled={ isService }
                        isInvalid={ hasError && !isService && !method.pricingMethodId }
                        onValueChange={ (pricingMethod) =>
                        {
                          updatePricingMethod(index, {
                            pricingMethodId: pricingMethod?.id,
                            pricingMethodName: pricingMethod?.name
                          });
                        } }
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      min={ 1 }
                      disabled={ method.unitId === formData.sellUnitId }
                      value={ method.quantityMultiplier ?? 1 }
                      onChange={ (val) => updatePricingMethod(index, { quantityMultiplier: val }) }
                      isInvalid={ hasError
                        && (method.quantityMultiplier == undefined || method.quantityMultiplier <= 0) }
                    />
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      min={ 0 }
                      value={ parseFloat((method.price / multiplier).toFixed(2)) ?? 0 }
                      onChange={ (val) =>
                        updatePricingMethod(index, { price: parseFloat(((val ?? 0) * multiplier).toFixed(2)) }) }
                      isInvalid={ hasError && (method.price == undefined || method.price <= 0) }
                      currency={ <CurrencyIcon /> }
                    />
                  </td>
                  <td className="p-3">
                    <TextFieldOld
                      label=""
                      value={ method.barcode || "" }
                      onChange={ (e) => updatePricingMethod(index, { barcode: e.target.value }) }
                    />
                  </td>
                  <td className="p-3">
                    <TextFieldOld
                      label=""
                      value={ method.itemUnitPricingMethodName || "" }
                      onChange={ (e) => updatePricingMethod(index, { itemUnitPricingMethodName: e.target.value }) }
                    />
                  </td>

                  { SystemPermissions.hasAuth(
                    authState.loggedInUser?.role?.permissions ?? [],
                    SystemPermissionsResources.ReportItemBarcode,
                    SystemPermissionsActions.Get
                  ) && (
                    <td className="p-3 text-center">
                      <ItemBarcodeButton item={ formData as Item } iupm={ method } />
                    </td>
                  ) }

                  { !isService && (
                    <td className="p-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={ () => removePricingMethod(index) }
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
        { formData.itemUnitPricingMethods?.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            { t("items.noPricingMethods") }
          </div>
        ) }
      </div>

      { hasError && errorMessage && (
        <div className="text-xs font-medium text-red-500 mt-2 animate-in fade-in slide-in-from-top-1">
          { errorMessage }
        </div>
      ) }
    </div>
  );
}
