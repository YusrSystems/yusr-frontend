import TaxesSearchableSelect from "@/core/components/searchableSelect/taxesSearchableSelect";
import type Item from "@/core/data/item";
import { ItemTax } from "@/core/data/itemTax";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, ChangeableEntityMode, CheckboxField, FormField, TextField } from "yusr-ui";
import { Tax } from "../../../core/data/tax";

export default function TaxesSection({ entity }: { entity: Item; })
{
  useSignals();
  const { t } = useTranslation("stocking");

  useEffect(() =>
  {
    if (entity.mode.value === ChangeableEntityMode.Create && !entity.isDirty.value && Cubits.taxes.entities?.value.length)
    {
      handleTaxableChange(true);
    }
  }, [Cubits.taxes.entities?.value]);

  const handleTaxableChange = (isTaxable: boolean) =>
  {
    entity.taxable.value = isTaxable;
    if (isTaxable)
    {
      const primaryTaxes = (Cubits.taxes.entities?.value || [])
        .filter((t: Tax) => t.isPrimary)
        .map((t: Tax) =>
          new ItemTax({
            id: 0,
            itemId: entity.id.value,
            taxId: t.id.value,
            taxName: t.name.value,
            taxPercentage: t.percentage.value
          })
        );

      entity.itemTaxes.value = primaryTaxes;
      entity.exemptionReason.value = "";
      entity.exemptionReasonCode.value = "";
    }
    else
    {
      entity.itemTaxes.value = [];
    }
  };

  const addTax = () =>
  {
    entity.itemTaxes.value = [
      ...entity.itemTaxes.value,
      new ItemTax({ id: 0, itemId: entity.id.value, taxId: undefined, taxName: "", taxPercentage: 0 })
    ];
  };

  return (
    <div className="pt-6 border-t">
      <div className="flex mb-4 justify-between gap-3 items-end">
        <CheckboxField
          label={ t("items.taxable") }
          error={ entity.getError("taxable") }
          checked={ entity.taxable }
          onCheckedChange={ handleTaxableChange }
        />

        { entity.taxable.value && (
          <Button type="button" size="lg" onClick={ addTax } className="flex items-center justify-center h-8">
            <Plus className="w-4 h-4 me-2" /> { t("items.addTax") }
          </Button>
        ) }
      </div>

      { !entity.taxable.value
        ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 bg-muted/10 p-4 rounded-lg border">
            <TextField
              label={ t("items.exemptionReasonCode") }
              placeholder={ t("items.exemptionReasonCodePlaceholder") }
              value={ entity.exemptionReasonCode }
            />
            <TextField
              label={ t("items.exemptionReason") }
              placeholder={ t("items.exemptionReasonPlaceholder") }
              value={ entity.exemptionReason }
            />
          </div>
        )
        : (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-muted/20 rounded-lg border overflow-hidden">
              <table className="w-full text-sm text-right">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-3 w-16">{ t("items.number") }</th>
                    <th className="p-3 text-start">{ t("items.tax") }</th>
                    <th className="p-3 w-50 text-start">{ t("items.taxPercentage") }</th>
                    <th className="p-3 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  { entity.itemTaxes?.value.map((tax, index) =>
                  {
                    return (
                      <tr key={ index } className="border-t border-muted">
                        <td className="p-3 font-bold">{ index + 1 }</td>
                        <td className="p-3">
                          <FormField
                            label=""
                            error={ tax.getError("taxId") }
                          >
                            <TaxesSearchableSelect
                              id={ tax.taxId }
                              label={ tax.taxName }
                              onSelect={ (selectedTax) =>
                              {
                                tax.taxPercentage.value = selectedTax?.percentage.value;
                              } }
                            />
                          </FormField>
                        </td>
                        <td className="p-3">
                          <TextField
                            label=""
                            value={ tax.taxPercentage }
                            disabled
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={ `text-red-500 hover:text-red-700 hover:bg-red-100` }
                            onClick={ () =>
                            {
                              entity.itemTaxes.value = entity.itemTaxes.value.filter((_, i) => i !== index);
                            } }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  }) }
                </tbody>
              </table>
              { (!entity.itemTaxes.value || entity.itemTaxes.value.length === 0) && (
                <div className="p-4 text-center text-muted-foreground">
                  { t("items.noTaxes") }
                </div>
              ) }
            </div>
          </div>
        ) }
    </div>
  );
}
