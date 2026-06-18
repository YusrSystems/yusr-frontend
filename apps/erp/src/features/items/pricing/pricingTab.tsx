import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect";
import type Item from "@/core/data/item";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { ChangeableEntityMode, CheckboxField, FieldsSection, FormField, NumberField } from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import PricingMethodsTable from "./pricingMethodsTable";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export default function PricingTab({entity}: { entity: Item; })
{
	useSignals();
	const {t} = useTranslation("stocking");

	return (
		<div className="space-y-6 animate-in fade-in">
			<FieldsSection columns={ 4 }>
				<FormField
					label={ t("items.baseUnit") }
					required={ entity.type.value !== ItemType.Service }
					error={ entity.getError("sellUnitId") }
				>
					<UnitsSearchableSelect
						id={ entity.sellUnitId }
						label={ entity.sellUnitName }
						disabled={ entity.type.value === ItemType.Service || entity.mode.value === ChangeableEntityMode.Update }
						onSelect={ (unit) =>
						{
							entity.itemUnitPricingMethods.value.forEach((iupm) =>
							{
								if (iupm.unitId.value === unit?.id.value)
								{
									iupm.quantityMultiplier.value = 1;
								}
							});
						} }
					/>
				</FormField>

				<NumberField
					label={ t("items.initialCost") }
					required
					disabled={ entity.mode.value === ChangeableEntityMode.Update }
					value={ entity.initialCost }
					error={ entity.getError("initialCost") }
					currency={ <ErpCurrencyIcon/> }
				/>

				<NumberField
					label={ t("items.cost") }
					disabled
					value={ entity.cost }
					currency={ <ErpCurrencyIcon/> }
				/>

				<NumberField
					label={ t("items.lastBuyPrice") }
					disabled
					value={ entity.lastBuyPrice }
					currency={ <ErpCurrencyIcon/> }
				/>

				<CheckboxField
					required
					id="taxIncluded"
					label={ t("items.priceIncludesTax") }
					error={ entity.getError("taxIncluded") }
					checked={ entity.taxIncluded }
				/>
			</FieldsSection>

			<PricingMethodsTable entity={ entity }/>
		</div>
	);
}
