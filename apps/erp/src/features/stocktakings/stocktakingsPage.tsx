import type { StocktakingDto } from "@/core/data/stocktaking";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ClipboardCheck, Printer } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
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
import ChangeStocktakingDialog from "./changeStocktakingDialog";
import { createPortal } from "react-dom";
import { StocktakingReport } from "@/features/reports/stocktaking/stocktakingReport.tsx";
import { signal } from "@preact/signals-react";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";


export default function StocktakingsPage()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	useEffect(() => Cubits.stocktaking.init(), []);

	const printedStocktaking = useMemo(() => signal<StocktakingDto | undefined>(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Stocktakings, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
			<CrudPage<StocktakingDto>>
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

				<PageTable onPrint={ (stocktaking) =>
				{
					printedStocktaking.value = stocktaking;
					requestAnimationFrame(() =>
					{
						requestAnimationFrame(() =>
						{
							window.print();
						});
					});
				} }/>

				<CrudPage.ChangeDialog
					changeDialog={ (dto: StocktakingDto | undefined, closeDialog) =>
					{
						return (
							<ChangeStocktakingDialog
								addDialogTitle={ t("stocktakings.addNewTitle") }
								updateDialogTitle={ `${ t("common:crudRow.edit") } ${ t("stocktakings.entityName") }` }
								dto={ dto }
								service={ Services.stocktakingApi }
								onSuccess={ (data, mode) =>
								{
									if (mode === ChangeableEntityMode.Create)
									{
										Cubits.stocktaking.add(data);
										closeDialog();
									}
									else if (mode === ChangeableEntityMode.Update)
									{
										Cubits.stocktaking.update(data);
									}
								} }
							/>
						);
					} }
				/>

				<CrudPage.DeleteDialog
					entityNameSelector={ () => `"${ t("stocktakings.entityName") }"` }
					service={ Services.stocktakingApi }
					onSuccess={ (entity) => Cubits.stocktaking.delete(entity) }
				/>
			</CrudPage>

			{ createPortal(
				<PortalReportContainer>
					<StocktakingReport stocktaking={ printedStocktaking.value }/>
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
				title: t("stocktakings.totalStocktakings"),
				data: Cubits.stocktaking.count.value.toString(),
				icon: <ClipboardCheck className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable({onPrint}: { onPrint: (stocktaking: StocktakingDto) => void })
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
				<CrudPage.TableBody<StocktakingDto>
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
						{rowBody: stocktaking.date, rowStyles: ""},
						{rowBody: stocktaking.storeName, rowStyles: "font-semibold"},
						{rowBody: stocktaking.description ?? "-", rowStyles: "text-sm text-gray-500"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportStocktaking,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: (
									<Button
										onClick={ () => onPrint(stocktaking) }
									>
										<Printer className="h-4 w-4"/>
									</Button>
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
