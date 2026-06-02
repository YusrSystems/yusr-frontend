import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect";
import { useTranslation } from "react-i18next";
import { CheckboxField, CurrencyIcon, type DialogMode, FieldsSection, FormFieldOld, NumberField, useFormErrors } from "yusr-ui";
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
      <FieldsSection columns={ 4 }>
        <FormFieldOld
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
        </FormFieldOld>

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

        <NumberField
          label={ t("items.lastBuyPrice") }
          disabled
          value={ formData.lastBuyPrice ?? 0 }
          currency={ <CurrencyIcon /> }
        />

        <CheckboxField
          required
          id="taxIncluded"
          label={ t("items.priceIncludesTax") }
          error={ getError("taxIncluded") }
          isInvalid={ isInvalid("taxIncluded") }
          checked={ formData.taxIncluded ?? false }
          onCheckedChange={ (checked) =>
            dispatch(ItemSlice.formActions.updateFormData({ taxIncluded: checked as boolean })) }
        />
      </FieldsSection>

      <PricingMethodsTable />
    </div>
  );
}
