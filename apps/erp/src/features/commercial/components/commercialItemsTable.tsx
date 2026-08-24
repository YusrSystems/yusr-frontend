import { GripVertical, Trash2 } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	cn,
	type ColumnDef,
	ColumnVisibilityToggle,
	i18n,
	NumberField,
	SelectField,
	SystemPermissionsActions,
	TablePreview,
	TextAreaField,
	TextField,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	useColumnVisibility
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { ItemType } from "@/core/data/item";
import { CommercialMath } from "../logic/commercialMath";
import type {
	CommercialDocument,
	ICommercialDocument,
	ICommercialDocumentDto
} from "@/core/data/commercial/commercialDocument";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem";


export interface CommercialItemsTableProps<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>
{
	document: CommercialDocument<TDto, TItem, TItemDto>;
	isSalesDocument?: boolean;
	showCostColumn?: boolean;
	allowReturnQuantityConstraint?: boolean;
	renderExtraAction?: (item: TItem, index: number) => React.ReactNode;
}

export function CommercialItemsTable<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>({
	document,
	isSalesDocument = true,
	showCostColumn = true,
	allowReturnQuantityConstraint = false,
	renderExtraAction
}: CommercialItemsTableProps<TDto, TItem, TItemDto>)
{
	useSignals();
	const {t} = useTranslation(["accounting", "stocking"]);
	const focusedQuantityIndex = useMemo(() => signal<number | undefined>(undefined), []);
	const errorMessage = document.getError("items");

	const hasSettlementPerm = Services.auth.hasAuth(
		SystemPermissionsResources.InvoiceAddSettlement,
		SystemPermissionsActions.Get
	);

	const COLUMNS: ColumnDef[] = [
		...(showCostColumn ? [{key: "cost", label: t("invoices.cost")}] : []),
		{key: "priceWithoutTax", label: t("invoices.priceWithoutTax")},
		{key: "taxPercentage", label: t("invoices.taxPercentage")},
		...(hasSettlementPerm ? [{key: "settlement", label: t("invoices.settlement")}] : []),
		...(showCostColumn ? [{key: "finalCost", label: t("invoices.finalCost")}] : []),
		{key: "finalPriceWithoutTax", label: t("invoices.finalPriceWithoutTax")}
	];

	const {visible, toggle, isVisible} = useColumnVisibility(
		"commercial_columns",
		COLUMNS.map((c) => c.key)
	);

	const getMaxAllowedQuantity = (originalQty: number) =>
	{
		if (allowReturnQuantityConstraint) return originalQty;
		if (!isSalesDocument) return Number.MAX_SAFE_INTEGER;
		return Services.auth.hasAuth(
			SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity,
			SystemPermissionsActions.Get
		)
			? Number.MAX_SAFE_INTEGER
			: originalQty;
	};

	const getMinAllowedTaxInclusivePrice = (originalTaxInclusivePrice: number) =>
	{
		if (!isSalesDocument) return 0;
		return Services.auth.hasAuth(
			SystemPermissionsResources.InvoiceSellBelowSellingPrice,
			SystemPermissionsActions.Get
		)
			? 0
			: originalTaxInclusivePrice;
	};

	const dragState = useMemo(
		() =>
			signal<{ draggedIndex: number | undefined; dragOverIndex: number | undefined }>({
				draggedIndex: undefined,
				dragOverIndex: undefined
			}),
		[]
	);

	const handleDragStart = useCallback(
		(index: number) =>
		{
			dragState.value.draggedIndex = index;
			dragState.value.dragOverIndex = undefined;
		},
		[dragState.value]
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent, index: number) =>
		{
			e.preventDefault();
			if (dragState.value.dragOverIndex !== index)
			{
				dragState.value.dragOverIndex = index;
			}
		},
		[dragState.value]
	);

	const handleDrop = useCallback(
		(reorderedItems: TItem[]) =>
		{
			document.items.value = reorderedItems;
			dragState.value.draggedIndex = undefined;
			dragState.value.dragOverIndex = undefined;
		},
		[dragState.value, document]
	);

	const handleDragEnd = useCallback(() =>
	{
		dragState.value.draggedIndex = undefined;
		dragState.value.dragOverIndex = undefined;
	}, [dragState.value]);

	const items = document.items.value;

	if (!items || items.length === 0)
	{
		return (
			<div>
				<TablePreview.Empty
					className={ `bg-muted/20 rounded-lg border overflow-hidden overflow-x-auto transition-colors ${
						errorMessage?.value ? "border-red-500" : ""
					}` }
				/>
				{ errorMessage?.value && (
					<div className="text-sm font-medium text-red-500 mt-2 animate-in fade-in slide-in-from-top-1">
						{ errorMessage.value }
					</div>
				) }
			</div>
		);
	}

	const fixedColCount = 7;
	const actionColCount = (renderExtraAction ? 1 : 0) + 1;
	const visibleCount = COLUMNS.filter((c) => isVisible(c.key)).length;
	const totalColSpan = fixedColCount + visibleCount + actionColCount;

	const handleRowDrop = () =>
	{
		const {draggedIndex, dragOverIndex} = dragState.value;
		if (draggedIndex === undefined || dragOverIndex === undefined || draggedIndex === dragOverIndex) return;
		const nextItems = [...items];
		const [removed] = nextItems.splice(draggedIndex, 1);
		if (removed !== undefined)
		{
			nextItems.splice(dragOverIndex, 0, removed);
		}
		handleDrop(nextItems);
	};

	return (
		<div className="w-full border border-border rounded-lg shadow-sm bg-background">
			<div className="flex justify-end p-2 border-b border-border">
				<ColumnVisibilityToggle columns={ COLUMNS } visible={ visible } toggle={ toggle }/>
			</div>
			<div className="max-h-100 overflow-y-auto overflow-x-auto">
				<table className="relative w-full text-sm text-right">
					<thead className="sticky top-0 bg-muted z-50 border-b border-border">
					<tr>
						<th className="p-3 w-5"/>
						<th className="p-3 font-semibold w-16 text-muted-foreground">{ t("invoices.number") }</th>
						<th className="p-3 font-semibold text-start w-40">{ t("invoices.item") }</th>
						<th className="p-3 font-semibold text-start w-24 min-w-24">{ t("stocking:items.unit") }</th>
						<th className="p-3 font-semibold text-start w-24 min-w-24">{ t("invoices.pricingMethod") }</th>
						{ isVisible("cost") && (
							<th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.cost") }</th>
						) }
						<th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.quantity") }</th>
						{ isVisible("priceWithoutTax") && (
							<th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceWithoutTax") }</th>
						) }
						{ isVisible("taxPercentage") && (
							<th className="p-3 font-semibold text-start w-18 min-w-18">{ t("invoices.taxPercentage") }</th>
						) }
						<th className="p-3 font-semibold text-start w-30 min-w-30">{ t("invoices.priceAfterTax") }</th>
						{ hasSettlementPerm && isVisible("settlement") && (
							<th className="p-3 font-semibold text-start w-25 min-w-25">{ t("invoices.settlement") }</th>
						) }
						{ isVisible("finalCost") && (
							<th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalCost") }</th>
						) }
						{ isVisible("finalPriceWithoutTax") && (
							<th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithoutTax") }</th>
						) }
						<th className="p-3 font-semibold text-start w-35 min-w-35">{ t("invoices.finalPriceWithTax") }</th>
						{ renderExtraAction && <th className="p-4 font-semibold w-3 text-center"/> }
						<th className="p-4 font-semibold w-3 text-center"/>
					</tr>
					</thead>
					<tbody>
					{ items.map((invoiceItem, index) =>
					{
						const isDragging = dragState.value.draggedIndex === index;
						const isDraggingOver = dragState.value.dragOverIndex === index;
						const multiplier = isSalesDocument ? -1 : 1;
						const remaining =
							invoiceItem.originalQuantity.value +
							invoiceItem.quantity.value * invoiceItem.quantityMultiplier.value * multiplier;
						const isLowStock = remaining < 0;

						return (
							<React.Fragment key={ `${ invoiceItem.id.value }-${ index }` }>
								<tr
									draggable={ !document.isDisabled }
									onDragStart={ () => handleDragStart(index) }
									onDragOver={ (e) => handleDragOver(e, index) }
									onDrop={ handleRowDrop }
									onDragEnd={ handleDragEnd }
									className={ cn(
										"border-border last:border-0 transition-colors",
										isDragging ? "opacity-40" : "hover:bg-muted/20",
										isDraggingOver ? "border-t-2 border-t-primary" : ""
									) }
								>
									<td className={ cn("px-2 pt-2", document.isDisabled ? "invisible" : "cursor-grab active:cursor-grabbing") }>
										<GripVertical className="h-4 w-4 text-muted-foreground"/>
									</td>
									<td className="px-2 pt-2 font-bold text-muted-foreground">{ index + 1 }</td>
									<td className="px-2 pt-2">
										<div
											className="font-semibold text-start text-foreground">{ invoiceItem.itemName }</div>
									</td>
									<td className="px-2 pt-2">
										{ document.isDisabled ? (
											<div
												className="font-semibold text-foreground">{ invoiceItem.unitName }</div>
										) : (
											<SelectField<number>
												value={ invoiceItem.itemUoMId }
												placeholder={ t("stocking:items.unit") }
												error={ invoiceItem.getError("itemUoMId") }
												disabled={ document.isDisabled || invoiceItem.itemType.value === ItemType.Service }
												options={
													invoiceItem.uoMDtos.value?.map((m) => ({
														label: m.unitName.value,
														value: m.id.value
													})) || []
												}
												onValueChange={ (uomId) => invoiceItem.changeUoM(uomId) }
											/>
										) }
									</td>
									<td className="px-2 pt-2">
										{ document.isDisabled ? (
											<div
												className="font-semibold text-foreground">{ invoiceItem.pricingMethodName }</div>
										) : (
											<SelectField<number>
												value={ invoiceItem.pricingMethodId }
												placeholder={ t("invoices.selectPricingMethod") }
												disabled={ document.isDisabled || invoiceItem.itemType.value === ItemType.Service }
												options={
													invoiceItem.uoMDtos.value
														?.find((u) => u.id.value === invoiceItem.itemUoMId.value)
														?.prices.value?.map((p) => ({
														label: p.pricingMethodName.value,
														value: p.pricingMethodId.value
													})) || []
												}
												onValueChange={ (pmId) =>
												{
													const uom = invoiceItem.uoMDtos.value?.find(
														(u) => u.id.value === invoiceItem.itemUoMId.value
													);
													const pmName = uom?.prices.value?.find(
														(p) => p.pricingMethodId.value === pmId
													)?.pricingMethodName.value;
													if (pmId)
													{
														invoiceItem.changePricingMethod(pmId, pmName);
													}
												} }
											/>
										) }
									</td>
									{ isVisible("cost") && (
										<td className="px-2 pt-2">
											{ invoiceItem.itemType.value !== ItemType.Service || document.isDisabled ? (
												<TextField value={ invoiceItem.cost.value.toFixed(2) } disabled/>
											) : (
												<NumberField min={ 0 } value={ invoiceItem.cost }/>
											) }
										</td>
									) }
									<td className="px-2 pt-2">
										<Tooltip open={ focusedQuantityIndex.value === index }>
											<TooltipTrigger asChild>
												<NumberField
													min={ 0 }
													step={ 0.1 }
													max={ getMaxAllowedQuantity(invoiceItem.originalQuantity.value) }
													value={ invoiceItem.quantity }
													error={ invoiceItem.getError("quantity") }
													onChange={ (newValue) =>
													{
														if (newValue === undefined) return;
														invoiceItem.changeQuantity(newValue);
													} }
													disabled={
														invoiceItem.itemType.value === ItemType.Service
															? false
															: allowReturnQuantityConstraint
																? false
																: document.isDisabled
													}
													onFocus={ () => (focusedQuantityIndex.value = index) }
													onBlur={ () => (focusedQuantityIndex.value = undefined) }
												/>
											</TooltipTrigger>
											<TooltipContent className="flex flex-col gap-1 min-w-40" dir={ i18n.dir() }>
												<span className="text-xs">{ t("invoices.quantityInStore") }</span>
												<span
													className={ cn(
														"text-lg font-medium",
														isLowStock && "text-red-600 dark:text-red-400"
													) }
												>
													{ remaining }
												</span>
											</TooltipContent>
										</Tooltip>
									</td>
									{ isVisible("priceWithoutTax") && (
										<td className="px-2 pt-2">
											<TextField disabled
											           value={ invoiceItem.taxExclusivePrice.value.toFixed(2) }/>
										</td>
									) }
									{ isVisible("taxPercentage") && (
										<td className="px-2 pt-2">
											<NumberField value={ invoiceItem.totalTaxesPerc } disabled/>
										</td>
									) }
									<td className="px-2 pt-2">
										<NumberField
											min={ getMinAllowedTaxInclusivePrice(invoiceItem.originalTaxInclusivePrice.value) }
											value={ invoiceItem.taxInclusivePrice }
											disabled={ document.isDisabled }
											error={ invoiceItem.getError("taxInclusivePrice") }
											onChange={ (newValue) =>
											{
												if (newValue === undefined) return;
												invoiceItem.changeTaxInclusivePrice(newValue);
											} }
										/>
									</td>
									{ hasSettlementPerm && isVisible("settlement") && (
										<td className="px-2 pt-2">
											<NumberField
												value={ invoiceItem.settlement }
												disabled={ document.isDisabled }
												onChange={ (newValue) =>
												{
													if (newValue === undefined) return;
													invoiceItem.changeSettlement(newValue, true);
												} }
											/>
										</td>
									) }
									{ isVisible("finalCost") && (
										<td className="px-2 pt-2">
											<TextField
												value={ CommercialMath.round2(
													invoiceItem.cost.value * invoiceItem.quantity.value
												).toFixed(2) }
												disabled
											/>
										</td>
									) }
									{ isVisible("finalPriceWithoutTax") && (
										<td className="px-2 pt-2">
											<TextField value={ invoiceItem.taxExclusiveTotalPrice.value.toFixed(2) }
											           disabled/>
										</td>
									) }
									<td className="px-2 pt-2">
										<TextField value={ invoiceItem.taxInclusiveTotalPrice.value.toFixed(2) }
										           disabled/>
									</td>
									{ renderExtraAction && (
										<td className="px-2 pt-2 text-center">{ renderExtraAction(invoiceItem, index) }</td>
									) }
									{ document.mode.value !== ChangeableEntityMode.Update && (
										<td className="px-2 pt-2 text-center">
											<button
												type="button"
												onClick={ () => document.removeItem(index) }
												className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
												aria-label={ t("invoices.deleteItem") }
											>
												<Trash2 className="h-5 w-5"/>
											</button>
										</td>
									) }
								</tr>
								<tr
									className="bg-muted/10 border-b"
									onDragOver={ (e) => handleDragOver(e, index) }
									onDrop={ handleRowDrop }
								>
									<td colSpan={ totalColSpan } className="px-5 pt-1 pb-3">
										<TextAreaField
											collapsible
											collapsedHeight={ 36 }
											expandedHeight={ 150 }
											label=""
											placeholder={ t("invoices.addDiscription") }
											value={ invoiceItem.notes }
											error={ invoiceItem.getError("notes") }
											disabled={ document.isDisabled }
										/>
									</td>
								</tr>
							</React.Fragment>
						);
					}) }
					</tbody>
				</table>
			</div>
		</div>
	);
}