import type { StocktakingDto } from "@/core/data/stocktaking.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Scale } from "lucide-react";
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
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import ReportConstants from "../../core/data/report/reportConstants.ts";
import ReportButton from "../reports/reportButton.tsx";
import ChangeStocktakingDialog from "./changeStocktakingDialog.tsx";


export default function ItemsSettlementsPage()
{
	const {t} = useTranslation(["stocking", "common"]);
	useEffect(() => Cubits.itemsSettlements.init(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.ItemsSettlements, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<StocktakingDto>>
			<CrudPage.Header
				title={ t("itemsSettlements.title") }
				addButtonTitle={ t("itemsSettlements.addNewTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(
					SystemPermissionsResources.ItemsSettlements,
					SystemPermissionsActions.Add
				) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.itemsSettlements.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: StocktakingDto | undefined, closeDialog) =>
				{
					return (
						<ChangeStocktakingDialog
							addDialogTitle={ t("itemsSettlements.addNewTitle") }
							updateDialogTitle={ `${ t("common:crudRow.edit") } ${ t("itemsSettlements.entityName") }` }
							dto={ dto }
							service={ Services.itemsSettlementsApi }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									Cubits.itemsSettlements.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
								{
									Cubits.itemsSettlements.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ () => `"${ t("itemsSettlements.entityName") }"` }
				service={ Services.itemsSettlementsApi }
				onSuccess={ (entity) => Cubits.itemsSettlements.delete(entity) }
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
				title: t("itemsSettlements.totalSettlements"),
				data: Cubits.itemsSettlements.count.value.toString(),
				icon: <Scale className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (Cubits.itemsSettlements.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.itemsSettlements.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<StocktakingDto>
					data={ Cubits.itemsSettlements.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("itemsSettlements.settlementId"), rowStyles: "w-32"},
						{rowBody: t("itemsSettlements.date"), rowStyles: "w-32"},
						{rowBody: t("itemsSettlements.store"), rowStyles: "w-48"},
						{rowBody: t("itemsSettlements.description"), rowStyles: ""},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemSettlement,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (
						settlement
					) => [
						{rowBody: `#${ settlement.id }`, rowStyles: ""},
						{rowBody: settlement.date, rowStyles: ""},
						{rowBody: settlement.storeName, rowStyles: "font-semibold"},
						{rowBody: settlement.description ?? "-", rowStyles: "text-sm text-gray-500"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemSettlement,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: (
									<ReportButton
										reportName={ ReportConstants.ItemSettlement }
										request={ {itemSettlementId: settlement.id} }
									/>
								),
								rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.ItemsSettlements,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.ItemsSettlements,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.itemsSettlements.pageSize.value }
					totalNumber={ Cubits.itemsSettlements.count.value }
					currentPage={ Cubits.itemsSettlements.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.itemsSettlements.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.itemsSettlements.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
