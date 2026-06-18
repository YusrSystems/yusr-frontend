import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Store, type StoreDto } from "@/core/data/store";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Warehouse } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	CrudPage,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import ItemsListDialog from "../reports/itemsListDialog";
import ChangeStoreDialog from "./changeStoreDialog";
import { Cubits } from "@/core/services/cubits";


export default function StoresPage()
{
	const {t} = useTranslation("stocking");
	useEffect(() => Cubits.stores.init(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage>
			<CrudPage.Header
				title={ t("stores.title") }
				addButtonTitle={ t("stores.addNewTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Add) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.stores.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: StoreDto | undefined, closeDialog) =>
				{
					return (
						<ChangeStoreDialog
							entity={ dto
								? Store.load(dto)
								: Store.create() }
							service={ Services.storesApi }
							onSuccess={ (data) =>
							{
								if (data.mode.value === ChangeableEntityMode.Create)
								{
									Cubits.stores.add(data);
									closeDialog();
								}
								else if (data.mode.value === ChangeableEntityMode.Update)
								{
									Cubits.stores.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (store) => store.name }
				service={ Services.storesApi }
				onSuccess={ (entity) => Cubits.stores.delete(entity) }
			/>
		</CrudPage>
	);
}

function Cards()
{
	useSignals();
	const {t} = useTranslation("stocking");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("stores.totalStores"),
				data: Cubits.stores.count.value.toString(),
				icon: <Warehouse className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common", "erpCommon"]);

	if (Cubits.stores.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.stores.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<Store, StoreDto>
					data={ Cubits.stores.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{
							rowBody: t("stores.storeId"),
							rowStyles: "w-30"
						},
						{rowBody: t("stores.storeName"), rowStyles: "w-70"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemList,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (
						store
					) => [
						{rowBody: `#${ store.id }`, rowStyles: ""},
						{rowBody: store.name, rowStyles: "font-semibold"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemList,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: <ItemsListDialog store={ store }
								                          buttonLabel={ t("erpCommon:reports.itemsList") }/>,
								rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Taxes,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Taxes,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.stores.pageSize.value }
					totalNumber={ Cubits.stores.count.value }
					currentPage={ Cubits.stores.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.stores.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.stores.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
