import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect";
import { useTranslation } from "react-i18next";
import { Checkbox, CurrencyIcon, type DialogMode, FormField, NumberField, useFormErrors } from "yusr-ui";
import { ItemSlice, ItemType } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import PricingMethodsTable from "./pricingMethodsTable";

export default function PricingTab({ mode }: { mode: DialogMode; })
{
  const { t } = useTranslation("stocking");
  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-3 gap-6">
        <FormField
          label={ t("items.baseUnit") }
          required={ formData.type !== ItemType.Service }
          isInvalid={ isInvalid("sellUnitId") }
          error={ getError("sellUnitId") }
        >
          <UnitsSearchableSelect
            selectedId={ formData.sellUnitId }
            selectedLabel={ formData.sellUnitName }
            disabled={ formData.type === ItemType.Service || mode === "update" }
            isInvalid={ isInvalid("sellUnitId") }
            onValueChange={ (unit) =>
            {
              dispatch(ItemSlice.formActions.updateFormData({
                sellUnitId: unit?.id,
                sellUnitName: unit?.name
              }));

              dispatch(ItemSlice.formActions.updateFormData((prev) =>
              {
                const list = [...(prev.itemUnitPricingMethods || [])];
                list.forEach((iupm, i) =>
                {
                  if (iupm.unitId === unit?.id)
                  {
                    list[i] = {
                      ...iupm,
                      quantityMultiplier: 1
                    };
                  }
                });

                return { itemUnitPricingMethods: list };
              }));
            } }
          />
        </FormField>

        <NumberField
          label={ t("items.initialCost") }
          required
          disabled={ mode === "update" }
          value={ formData.initialCost ?? "" }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ initialCost: val })) }
          isInvalid={ isInvalid("initialCost") }
          error={ getError("initialCost") }
          currency={ <CurrencyIcon /> }
        />
        <NumberField
          label={ t("items.cost") }
          disabled
          value={ formData.cost ?? 0 }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ cost: val })) }
          currency={ <CurrencyIcon /> }
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="taxIncluded"
          checked={ formData.taxIncluded }
          onCheckedChange={ (checked) =>
            dispatch(ItemSlice.formActions.updateFormData({ taxIncluded: checked as boolean })) }
        />
        <label htmlFor="taxIncluded" className="text-sm font-bold">
          { t("items.priceIncludesTax") }
        </label>
      </div>

      <PricingMethodsTable />
    </div>
  );
}
