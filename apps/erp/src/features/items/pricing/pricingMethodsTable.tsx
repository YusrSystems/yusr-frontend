import PricingMethodsSearchableSelect from "@/core/components/searchableSelect/pricingMethodsSearchableSelect";
import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect";
import type Item from "@/core/data/item";
import { useSignals } from "@preact/signals-react/runtime";
import { Barcode, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, FormField, NumberField, SystemPermissionsActions, TextField } from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { ItemUoM } from "@/core/data/itemUoM.ts";
import { ItemPrice } from "@/core/data/itemPrice.ts";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import ItemBarcodeButton from "@/features/reports/itemBarcode/itemBarcodeDialog.tsx";


export function PricingMethodsTable({entity}: { entity: Item; })
{
	useSignals();
	const {t} = useTranslation("stocking");
	const errorMessage = entity.getError("uoMs");
	const isService = entity.type.value === ItemType.Service;

	const addUoMUnit = () =>
	{
		const newUnit = ItemUoM.create();
		newUnit.generateBarcode();
		entity.uoMs.value = [...entity.uoMs.value, newUnit];
	};

	const removeUoMUnit = (index: number) =>
	{
		entity.uoMs.value = entity.uoMs.value.filter((_, i) => i !== index);
	};

	return (
		<div className="space-y-3 pt-4 border-t border-dashed">
			<div className="flex justify-between items-center">
				<div>
					<h3 className="font-bold text-lg">{ t("items.packagingUnits", "وحدات المادة") }</h3>
				</div>
				{ !isService && (
					<Button type="button" size="sm" onClick={ addUoMUnit }>
						<Plus className="w-4 h-4 me-2"/> { t("items.addPackagingUnit", "إضافة وحدة") }
					</Button>
				) }
			</div>

			<div className="space-y-4">
				{ entity.uoMs.value.map((uoM, uoMIdx) => (
					<div key={ `${ uoM.id.value }-${ uoMIdx }` }
					     className="p-4 border rounded-xl bg-muted/10 space-y-4 relative">

						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
							<FormField label={ t("items.unit") } error={ uoM.getError("unitId") }>
								<UnitsSearchableSelect
									id={ uoM.unitId }
									label={ uoM.unitName }
									disabled={ isService }
									onSelect={ (unit) =>
									{
										uoM.unitName.value = unit?.name ?? "";
										if (unit?.id === entity.sellUnitId.value)
										{
											uoM.quantityMultiplier.value = 1;
										}
									} }
								/>
							</FormField>

							<NumberField
								label={ t("items.quantityInUnit") }
								min={ 0.0001 }
								value={ uoM.quantityMultiplier }
								disabled={ isService || uoM.unitId.value === entity.sellUnitId.value }
								error={ uoM.getError("quantityMultiplier") }
							/>

							<div className="flex flex-col gap-1.5 w-full">
								<label className="text-sm font-medium">{ t("items.barcode") }</label>
								<div className="flex">
									<TextField
										className="rounded-e-none"
										value={ uoM.barcode }
									/>
									<Button
										type="button"
										className="rounded-s-none shrink-0"
										onClick={ () => uoM.generateBarcode() }
									>
										<Barcode className="w-4 h-4"/>
									</Button>
								</div>
							</div>

							{ !isService && (
								<div className="h-full flex items-end justify-end md:pb-1">
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
										onClick={ () => removeUoMUnit(uoMIdx) }
									>
										<Trash2 className="w-4 h-4"/>
									</Button>
								</div>
							) }
						</div>

						<div className="border-t border-border/60 pt-4 space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="font-semibold text-sm text-primary">{ t("items.pricingTiers", "أسعار البيع") }</h4>
								{ !isService && (
									<Button
										type="button"
										size="sm"
										variant="outline"
										className="h-7 text-xs"
										onClick={ () => uoM.prices.value = [...uoM.prices.value, ItemPrice.create()] }
									>
										<Plus className="h-3 w-3 me-1.5"/>
										{ t("items.addPriceTier", "إضافة فئة سعر") }
									</Button>
								) }
							</div>

							<div className="bg-background rounded-lg border overflow-hidden">
								<table className="w-full text-sm text-right">
									<thead className="bg-muted/40 text-muted-foreground text-xs">
									<tr>
										<th className="p-2.5 w-16 text-center">#</th>
										<th className="p-2.5 text-start w-80">{ t("items.pricingMethod", "فئة البيع") }</th>
										<th className="p-2.5 text-start w-80">{ t("items.sellingPrice", {unit: entity.sellUnitName.value}) }</th>

										{ Services.auth.hasAuth(
											SystemPermissionsResources.ReportItemBarcode,
											SystemPermissionsActions.Get
										) && (
											<th className="p-2.5 w-16 text-center"></th>
										) }
										<th className="p-2.5 w-16 text-center"></th>
									</tr>
									</thead>
									<tbody className="divide-y">
									{ uoM.prices.value.map((price, prIdx) => (
										<tr key={ `${ price.id.value }-${ prIdx }` } className="hover:bg-muted/5">
											<td className="p-2 text-center font-bold text-muted-foreground">{ prIdx + 1 }</td>
											<td className="p-2">
												<FormField label="" error={ price.getError("pricingMethodId") }>
													<PricingMethodsSearchableSelect
														id={ price.pricingMethodId }
														label={ price.pricingMethodName }
														onSelect={ (m) => price.pricingMethodName.value = m?.name ?? "" }
													/>
												</FormField>
											</td>
											<td className="p-2">
												<NumberField
													label=""
													value={ price.price }
													error={ price.getError("price") }
													currency={ <ErpCurrencyIcon/> }
												/>
											</td>

											{ Services.auth.hasAuth(
												SystemPermissionsResources.ReportItemBarcode,
												SystemPermissionsActions.Get
											) && (
												<td className="p-3 text-center">
													<ItemBarcodeButton
														item={ entity }
														itemUoM={ uoM }
														itemPrice={ price }
													/>
												</td>
											) }

											<td className="p-2 text-center">
												{ !isService && (
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
														onClick={ () => uoM.prices.value = uoM.prices.value.filter((_, idx) => idx !== prIdx) }
													>
														<Trash2 className="w-4 h-4"/>
													</Button>
												) }
											</td>
										</tr>
									)) }
									</tbody>
								</table>
								{ uoM.prices.value.length === 0 && (
									<div className="p-4 text-center text-xs text-muted-foreground/60">
										{ t("items.noPriceTiers", "لا توجد أسعار مضافة لهذه الوحدة") }
									</div>
								) }
							</div>
							{ uoM.getError("prices").value && (
								<p className="text-xs font-semibold text-red-500 mt-1">{ uoM.getError("prices").value }</p>
							) }
						</div>

					</div>
				)) }
			</div>

			{ errorMessage.value && (
				<p className="text-sm font-semibold text-red-500 mt-2">{ errorMessage.value }</p>
			) }
		</div>
	);
}