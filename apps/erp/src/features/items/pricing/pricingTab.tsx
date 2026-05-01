import UnitsSearchableSelect from "@/core/components/unitsSearchableSelect";
import { Checkbox, type DialogMode, FormField, NumberField, useFormErrors } from "yusr-ui";
import { ItemSlice, ItemType } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import PricingMethodsTable from "./pricingMethodsTable";

export default function PricingTab({ mode }: { mode: DialogMode; })
{
  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-3 gap-6">
        <FormField
          label="الوحدة الأساسية للمادة"
          required={ formData.type !== ItemType.Service }
          isInvalid={ isInvalid("sellUnitId") }
          error={ getError("sellUnitId") }
        >
          <UnitsSearchableSelect
            unitId={ formData.sellUnitId }
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
          label="التكلفة المبدئية"
          required
          disabled={ mode === "update" }
          value={ formData.initialCost ?? "0" }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ initialCost: val })) }
          isInvalid={ isInvalid("initialCost") }
          error={ getError("initialCost") }
        />
        <NumberField
          label="التكلفة"
          disabled
          value={ formData.cost || "0" }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ cost: val })) }
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          checked={ formData.taxIncluded }
          onCheckedChange={ (checked) =>
            dispatch(ItemSlice.formActions.updateFormData({ taxIncluded: checked as boolean })) }
        />
        <label htmlFor="taxIncluded" className="text-sm font-bold">
          سعر البيع يشمل الضريبة
        </label>
      </div>

      <PricingMethodsTable />
    </div>
  );
}
