import type { ItemDto } from "@/core/data/item";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Package, Printer } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	ChangeableEntityMode,
	CrudPage,
	FilterLabelWrapper,
	FilterSection,
	type FilterValueInputProps,
	ImagePreview,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { ItemType } from "@/core/data/item.ts";
import ChangeItemDialog from "./changeItemDialog";
import { type Signal } from "@preact/signals-react";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import UnitsSearchableSelect from "@/core/components/searchableSelect/unitsSearchableSelect.tsx";
import { ItemsListReport } from "@/features/reports/itemsList/itemsListReport.tsx";
import { createPortal } from "react-dom";
import { AppNavigator } from "@/app/appNavigator.ts";
import { ItemBarcodeReport } from "@/features/reports/itemBarcode/itemBarcodeReport.tsx";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import {
	printBarcodesQtn,
	printItem,
	printItemPrice,
	printItemUoM
} from "@/features/reports/itemBarcode/itemBarcodePrintState.ts";
import TaxesMultiSearchableSelect from "@/core/components/searchableSelect/taxesMultiSearchableSelect.tsx";
import CategoriesMultiSearchableSelect from "@/features/itemCategories/categoriesMultiSearchableSelect.tsx";
import BrandsSearchableSelect from "@/core/components/searchableSelect/brandsSearchableSelect.tsx";
import { APP_NAME } from "../../../appConfig.ts";


export default function ItemsPage()
{
	useSignals();

	const {t} = useTranslation(["stocking", "erpCommon"]);

	useEffect(() =>
	{
		Cubits.items.init();
	}, []);

	useEffect(() =>
	{
		document.title = `${ t("items.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Items, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
			<CrudPage<ItemDto>>
				<CrudPage.Header
					title={ t("items.title") }
					addButtonTitle={ t("items.addNewTitle") }
					isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Items, SystemPermissionsActions.Add) }
					actionButtons={ [
						<Button
							key="print-list"
							variant="outline"
							onClick={ () =>
							{
								setTimeout(() =>
								{
									window.print();
								}, 100);
							} }
						>
							<Printer className="h-4 w-4"/>
							{ t("erpCommon:reports.itemsList") }
						</Button>
					] }
				/>

				<Cards/>

				<FilterSection
					fieldsCubit={ Cubits.itemFilterFields }
					onApply={ (groups) => Cubits.items.applyFilterGroups(groups) }
					onClear={ () => Cubits.items.clearFilterGroups() }
					renderCustomInput={ RenderItemFilterInput }
				/>

				<CrudPage.SearchInput
					className="rounded-t-none!"
					onSearch={ (text) => Cubits.items.search(text) }
				/>

				<PageTable/>

				<CrudPage.ChangeDialog
					fetchEntity={ async (id: number) =>
					{
						const result = await Services.itemsApi.Get(id);
						return result.data;
					} }
					changeDialog={ (dto: ItemDto | undefined, closeDialog) =>
					{
						return (
							<ChangeItemDialog
								dto={ dto }
								service={ Services.itemsApi }
								onSuccess={ (data, mode) =>
								{
									if (mode === ChangeableEntityMode.Create)
									{
										Cubits.items.add(data);
										closeDialog();
									}
									else if (mode === ChangeableEntityMode.Update)
									{
										Cubits.items.update(data);
									}
								} }
							/>
						);
					} }
				/>

				<CrudPage.DeleteDialog
					entityNameSelector={ (item) => item.name }
					service={ Services.itemsApi }
					onSuccess={ (entity) => Cubits.items.delete(entity) }
				/>
			</CrudPage>

			{ (printItem.value == undefined || printItemUoM.value == undefined) && createPortal(
				<PortalReportContainer>
					<ItemsListReport isPortal={ true }/>
				</PortalReportContainer>,
				document.body
			) }

			{ printItem.value && printItemUoM.value && createPortal(
				<PortalReportContainer>
					<ItemBarcodeReport
						item={ printItem.value }
						itemUoM={ printItemUoM.value }
						itemPrice={ printItemPrice.value }
						barcodesQtn={ printBarcodesQtn.value }
					/>
				</PortalReportContainer>,
				document.body
			) }
		</>
	);
}

function Cards()
{
	useSignals();
	const {t} = useTranslation("stocking");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("items.totalItems"),
				data: (Cubits.items.count.value ?? 0).toString(),
				icon: <Package className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common", "erpCommon"]);

	if (Cubits.items.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.items.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<ItemDto>
					isShareablePage={ true }
					data={ Cubits.items.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("items.itemId"), rowStyles: "w-20"},
						{rowBody: t("items.itemImages"), rowStyles: "w-20"},
						{rowBody: t("items.itemType"), rowStyles: "w-24"},
						{rowBody: t("items.itemName"), rowStyles: "w-48"},
						{rowBody: t("items.category", "التصنيف"), rowStyles: "w-32"},
						{rowBody: t("items.brand", "العلامة التجارية"), rowStyles: "w-32"},
						{rowBody: t("items.quantity"), rowStyles: "w-24"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemStatement,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (
						item
					) => [
						{rowBody: `#${ item.id }`, rowStyles: ""},
						{
							rowBody: (
								<ImagePreview
									files={ item.itemImages }
									size={ 40 }
									fallback={
										<div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
											<Package className="w-4 h-4 text-muted-foreground"/>
										</div>
									}
								/>
							),
							rowStyles: ""
						},
						{
							rowBody: item.type === ItemType.Product ? t("items.product") : t("items.service"),
							rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
								item.type === ItemType.Product
									? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
									: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
							}`
						},
						{rowBody: item.name, rowStyles: "font-semibold"},
						{
							rowBody: item.itemCategories?.map(c => c.categoryName).join(", ") || "-",
							rowStyles: "text-sm text-gray-500"
						},
						{rowBody: item.brandName ?? "-", rowStyles: "text-sm text-gray-500"},
						{rowBody: item.quantity?.toString() ?? "0", rowStyles: "font-mono"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportAccountStatement,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: <Button
									variant="outline"
									size="sm"
									onClick={ () =>
										AppNavigator.openInNewTab(
											`/reports/itemStatement/${ item.id }/${ encodeURIComponent(item.name) }`
										)
									}>
									{ t("erpCommon:itemStatement.button") }
								</Button>, rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Units,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Units,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.items.pageSize.value }
					totalNumber={ Cubits.items.count.value }
					currentPage={ Cubits.items.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.items.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.items.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}

export function RenderItemFilterInput({rule, field}: FilterValueInputProps)
{
	useSignals();

	if (field.propertyName === "ItemStores")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<StoresSearchableSelect
						id={ rule.value as unknown as Signal<number | undefined> }
						label={ label }
						onSelect={ entity =>
							rule.value.value = entity ? entity.id : ""
						}
					/>
				) }
			</FilterLabelWrapper>
		);
	}

	if (field.propertyName === "SellUnitId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<UnitsSearchableSelect
						id={ rule.value as unknown as Signal<number | undefined> }
						label={ label }
						onSelect={ entity =>
							rule.value.value = entity ? entity.id : ""
						}
					/>
				) }
			</FilterLabelWrapper>
		);
	}

	if (field.propertyName === "ItemTaxes")
	{
		return <TaxesMultiSearchableSelect onToggle={ (ids) => rule.value.value = ids }/>;
	}

	if (field.propertyName === "ItemCategories")
	{
		return <CategoriesMultiSearchableSelect onToggle={ (ids) => rule.value.value = ids }/>;
	}

	if (field.propertyName === "BrandId")
	{
		return (
			<FilterLabelWrapper rule={ rule }>
				{ label => (
					<BrandsSearchableSelect id={ rule.value as unknown as Signal<number | undefined> } label={ label }
					                        onSelect={ entity => rule.value.value = entity ? entity.id : "" }/>
				) }
			</FilterLabelWrapper>
		);
	}

	return undefined;
}