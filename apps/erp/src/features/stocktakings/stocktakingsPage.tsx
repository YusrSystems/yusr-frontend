import type { StocktakingDto } from "@/core/data/stocktaking";
import Stocktaking from "@/core/data/stocktaking";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ClipboardCheck } from "lucide-react";
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
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "../reports/reportButton";
import ChangeStocktakingDialog from "./changeStocktakingDialog";


export default function StocktakingsPage()
{
	const {t} = useTranslation(["stocking", "common"]);
	useEffect(() => Cubits.stocktaking.init(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Stocktakings, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage>
			<CrudPage.Header
				title={ t("stocktakings.title") }
				addButtonTitle={ t("stocktakings.addNewTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(
					SystemPermissionsResources.Stocktakings,
					SystemPermissionsActions.Add
				) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.stocktaking.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: StocktakingDto | undefined, closeDialog) =>
				{
					return (
						<ChangeStocktakingDialog
							addDialogTitle={ t("stocktakings.addNewTitle") }
							updateDialogTitle={ `${ t("common:crudRow.edit") } ${ t("stocktakings.entityName") }` }
							entity={ dto
								? Stocktaking.load(dto)
								: Stocktaking.create() }
							service={ Services.stocktakingApi }
							onSuccess={ (data) =>
							{
								if (data.mode.value === ChangeableEntityMode.Create)
								{
									Cubits.stocktaking.add(data);
									closeDialog();
								}
								else if (data.mode.value === ChangeableEntityMode.Update)
								{
									Cubits.stocktaking.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (stocktaking) => stocktaking.id }
				service={ Services.stocktakingApi }
				onSuccess={ (entity) => Cubits.stocktaking.delete(entity) }
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
				title: t("stocktakings.totalStocktakings"),
				data: Cubits.stocktaking.count.value.toString(),
				icon: <ClipboardCheck className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (Cubits.stocktaking.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.stocktaking.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<Stocktaking, StocktakingDto>
					data={ Cubits.stocktaking.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("stocktakings.stocktakingId"), rowStyles: "w-32"},
						{rowBody: t("stocktakings.date"), rowStyles: "w-32"},
						{rowBody: t("stocktakings.store"), rowStyles: "w-48"},
						{rowBody: t("stocktakings.description"), rowStyles: ""},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportStocktaking,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (
						stocktaking
					) => [
						{rowBody: `#${ stocktaking.id }`, rowStyles: ""},
						{rowBody: new Date(stocktaking.date.value).toLocaleDateString("en-CA"), rowStyles: "font-mono"},
						{rowBody: stocktaking.storeName, rowStyles: "font-semibold"},
						{rowBody: stocktaking.description ?? "-", rowStyles: "text-sm text-gray-500"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportStocktaking,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: (
									<ReportButton
										reportName={ ReportConstants.StockTaking }
										request={ {stocktakingId: stocktaking.id} }
									/>
								),
								rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Stocktakings,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Stocktakings,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.stocktaking.pageSize.value }
					totalNumber={ Cubits.stocktaking.count.value }
					currentPage={ Cubits.stocktaking.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.stocktaking.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.stocktaking.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
