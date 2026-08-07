import type { StocktakingDto } from "@/core/data/stocktaking.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Printer, Scale } from "lucide-react";
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
import ChangeStocktakingDialog from "./changeStocktakingDialog.tsx";
import { signal } from "@preact/signals-react";
import { createPortal } from "react-dom";
import { StocktakingReport } from "@/features/reports/stocktaking/stocktakingReport.tsx";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { APP_NAME } from "../../../appConfig.ts";
import { getTransactionStatusColor, getTransactionStatusName, TransactionStatus } from "@/core/types/transactionStatus";


export default function ItemsSettlementsPage()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	useEffect(() => Cubits.itemsSettlements.init(), []);

	useEffect(() =>
	{
		document.title = `${ t("itemsSettlements.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	const printedSettlement = useMemo(() => signal<StocktakingDto | undefined>(), []);

	useEffect(() =>
	{
		const settlement = printedSettlement.value;

		if (settlement)
		{
			document.title = `تسوية مواد رقم #${ settlement.id }`;
		}
		else
		{
			document.title = t("itemsSettlements.title");
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [printedSettlement.value, t]);

	if (!Services.auth.hasAuth(SystemPermissionsResources.ItemsSettlements, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
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

				<PageTable onPrint={ (settlement) =>
				{
					printedSettlement.value = settlement;
					const handleAfterPrint = () =>
					{
						printedSettlement.value = undefined;
						window.removeEventListener("afterprint", handleAfterPrint);
					};
					window.addEventListener("afterprint", handleAfterPrint);

					requestAnimationFrame(() =>
					{
						requestAnimationFrame(() =>
						{
							window.print();
						});
					});
				} }/>

				<CrudPage.ChangeDialog
					fetchEntity={ async (id: number) =>
					{
						const result = await Services.itemsSettlementsApi.Get(id);
						return result.data;
					} }
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

			{ createPortal(
				<PortalReportContainer>
					<StocktakingReport
						stocktaking={ printedSettlement.value }
						titleAr="تسوية مواد"
						titleEn="ITEMS SETTLEMENT"
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
				title: t("itemsSettlements.totalSettlements"),
				data: Cubits.itemsSettlements.count.value.toString(),
				icon: <Scale className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable({onPrint}: { onPrint: (stocktaking: StocktakingDto) => void })
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
					isShareablePage={ true }
					data={ Cubits.itemsSettlements.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("itemsSettlements.settlementId"), rowStyles: "w-32"},
						{rowBody: t("common:status.title", "الحالة"), rowStyles: "w-24"},
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
						{
							rowBody: (
								<span
									className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ getTransactionStatusColor(settlement.transactionStatus) }` }>
									{ getTransactionStatusName(settlement.transactionStatus) }
								</span>
							),
							rowStyles: ""
						},
						{rowBody: settlement.date, rowStyles: ""},
						{rowBody: settlement.storeName, rowStyles: "font-semibold"},
						{rowBody: settlement.description ?? "-", rowStyles: "text-sm text-gray-500"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemSettlement,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: (
									<Button
										onClick={ () => onPrint(settlement) }
									>
										<Printer className="h-4 w-4"/>
									</Button>
								),
								rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.ItemsSettlements,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ (settlement) =>
						settlement.transactionStatus !== TransactionStatus.Voided &&
						Services.auth.hasAuth(
							SystemPermissionsResources.ItemsSettlements,
							SystemPermissionsActions.Delete
						)
					}
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