import PricingMethodsSearchableSelect from "@/core/components/searchableSelect/pricingMethodsSearchableSelect";
import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect";
import type Item from "@/core/data/item";
import { useSignals } from "@preact/signals-react/runtime";
import { Barcode, Package, Plus, Receipt, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, FormField, NumberField, SystemPermissionsActions, TablePreview, TextField } from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { ItemUoM } from "@/core/data/itemUoM.ts";
import { ItemPrice } from "@/core/data/itemPrice.ts";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import ItemBarcodeButton from "@/features/reports/itemBarcode/itemBarcodeDialog.tsx";


export function PricingMethodsTable({entity}: { entity: Item })
{
	useSignals();
	const {t} = useTranslation("stocking");
	const errorMessage = entity.getError("uoMs");
	const isService = entity.type.value === ItemType.Service;
	const canSeeBarcode = Services.auth.hasAuth(
		SystemPermissionsResources.ReportItemBarcode,
		SystemPermissionsActions.Get
	);

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
		<div className="space-y-4 pt-5 border-t">
			<div className="flex justify-between items-center pb-2">
				<h3 className="font-semibold text-base flex items-center gap-2">
					<Package className="w-4 h-4 text-muted-foreground"/>
					{ t("items.packagingUnits", "وحدات المادة") }
				</h3>
				{ !isService && (
					<Button type="button" size="sm" onClick={ addUoMUnit } className="h-8 shrink-0 text-xs">
						<Plus className="w-3.5 h-3.5 me-1.5"/> { t("items.addPackagingUnit", "إضافة وحدة") }
					</Button>
				) }
			</div>

			<div className="space-y-4">
				{ entity.uoMs.value.map((uoM, uoMIdx) => (
					<div
						key={ `${ uoM.id.value }-${ uoMIdx }` }
						className="rounded-md border bg-card shadow-sm transition-all duration-200"
					>
						<div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b">
							<div className="flex items-center gap-2.5">
								<div
									className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary text-[11px] font-bold">
									{ uoMIdx + 1 }
								</div>
								<span className="font-medium text-sm">
									{ uoM.unitName.value || t("items.newUnit", "وحدة جديدة") }
								</span>
								{ uoM.unitId.value === entity.sellUnitId.value && (
									<span
										className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
										{ t("items.baseUnit", "الوحدة الأساسية") }
									</span>
								) }
							</div>

							{ !isService && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
									onClick={ () => removeUoMUnit(uoMIdx) }
									title={ t("items.deleteUnit", "حذف الوحدة") }
								>
									<Trash2 className="w-3.5 h-3.5"/>
								</Button>
							) }
						</div>

						<div className="p-4 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
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
									value={ uoM.quantityMultiplier }
									disabled={ isService || uoM.unitId.value === entity.sellUnitId.value }
									error={ uoM.getError("quantityMultiplier") }
								/>

								<FormField label={ t("items.barcode") }>
									<div className="flex">
										<TextField
											className="rounded-e-none"
											value={ uoM.barcode }
										/>
										<Button
											type="button"
											variant="outline"
											className="rounded-s-none border-s-0 bg-muted/30 hover:bg-muted text-muted-foreground"
											onClick={ () => uoM.generateBarcode() }
											title="توليد"
										>
											<Barcode className="w-4 h-4 me-1.5"/>
											<span className="text-xs">
												توليد
											</span>
										</Button>
									</div>
								</FormField>
							</div>

							<div className="pt-2">
								<div className="rounded-md border border-border/60 bg-background overflow-hidden">
									<table className="w-full text-sm text-start">
										<thead>
										<tr className="bg-muted/30 border-b border-border/60 text-muted-foreground">
											<th className="py-2.5 px-3 w-10 text-center font-medium text-xs">#</th>
											<th className="py-2.5 px-3 text-start font-medium text-xs">
												<span className="flex items-center gap-1.5">
													<Receipt className="w-3.5 h-3.5"/>
													{ t("items.pricingMethod", "فئة البيع") }
												</span>
											</th>
											<th className="py-2.5 px-3 text-start font-medium text-xs w-[35%]">
												{ t("items.sellingPrice", {unit: entity.sellUnitName.value}) }
											</th>
											{ canSeeBarcode && (
												<th className="py-2.5 px-3 w-10 text-center"></th>
											) }
											<th className="py-2.5 px-3 w-10 text-center"></th>
										</tr>
										</thead>
										<tbody className="divide-y divide-border/40">
										{ uoM.prices.value.length > 0 ? (
											uoM.prices.value.map((price, prIdx) => (
												<tr
													key={ `${ price.id.value }-${ prIdx }` }
													className="hover:bg-muted/10 transition-colors group"
												>
													<td className="p-1.5 px-2 text-center text-muted-foreground text-xs font-medium align-middle">
														{ prIdx + 1 }
													</td>
													<td className="p-1.5 px-2 align-top">
														<FormField label="" error={ price.getError("pricingMethodId") }>
															<PricingMethodsSearchableSelect
																id={ price.pricingMethodId }
																label={ price.pricingMethodName }
																onSelect={ (m) => (price.pricingMethodName.value = m?.name ?? "") }
															/>
														</FormField>
													</td>
													<td className="p-1.5 px-2 align-top">
														<NumberField
															label=""
															value={ price.unitPrice }
															error={ price.getError("price") }
															currency={ <ErpCurrencyIcon/> }
														/>
													</td>
													{ canSeeBarcode && (
														<td className="p-1.5 px-2 text-center align-middle">
															<ItemBarcodeButton
																item={ entity }
																itemUoM={ uoM }
																itemPrice={ price }
															/>
														</td>
													) }
													<td className="p-1.5 px-2 text-center align-middle">
														{ !isService && (
															<Button
																type="button"
																variant="ghost"
																size="icon"
																className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
																onClick={ () =>
																	(uoM.prices.value = uoM.prices.value.filter(
																		(_, idx) => idx !== prIdx
																	))
																}
															>
																<Trash2 className="w-4 h-4"/>
															</Button>
														) }
													</td>
												</tr>
											))
										) : (
											<tr>
												<td
													colSpan={ canSeeBarcode ? 5 : 4 }
													className="py-5 text-center text-sm text-muted-foreground/60"
												>
													{ t("items.noPriceTiers", "لا توجد أسعار مضافة") }
												</td>
											</tr>
										) }
										</tbody>
									</table>

									{ !isService && (
										<div className="p-1.5 bg-muted/10">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="w-full h-8 border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/30 text-xs"
												onClick={ () =>
													(uoM.prices.value = [...uoM.prices.value, new ItemPrice(undefined, uoM.quantityMultiplier)])
												}
											>
												<Plus className="h-3.5 w-3.5 me-1.5"/>
												{ t("items.addPriceTier", "إضافة فئة سعر") }
											</Button>
										</div>
									) }
								</div>

								{ uoM.getError("prices").value && (
									<div
										className="p-3 mt-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20">
										{ uoM.getError("prices").value }
									</div>
								) }
							</div>
						</div>
					</div>
				)) }
			</div>

			{ entity.uoMs.value.length <= 0 && (
				<TablePreview.Empty className="rounded-xl!"/>
			) }

			{ errorMessage.value && (
				<div
					className="p-3 mt-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20">
					{ errorMessage.value }
				</div>
			) }
		</div>
	);
}