import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ReportConstants from "@/core/data/report/reportConstants";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowRightLeft } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	CrudPage,
	NumbertoWordsService,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import ReportButton from "../reports/reportButton";
import ChangeBalanceTransferDialog from "./changeBalanceTransferDialog";
import { BalanceTransferDto } from "@/core/data/balanceTransfer.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export default function BalanceTransfersPage()
{
	useSignals();
	const {t} = useTranslation("accounting");
	useEffect(() => Cubits.balanceTransfers.init(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.BalanceTransfers, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<BalanceTransferDto>>
			<CrudPage.Header
				title={ t("balanceTransfers.title") }
				addButtonTitle={ t("balanceTransfers.addNewTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(
					SystemPermissionsResources.BalanceTransfers,
					SystemPermissionsActions.Add
				) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.balanceTransfers.search(searchText) }/>
			<Table/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: BalanceTransferDto | undefined, closeDialog) =>
				{
					return (
						<ChangeBalanceTransferDialog
							dto={ dto }
							service={ Services.balanceTransfersApi }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									Cubits.balanceTransfers.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
								{
									Cubits.balanceTransfers.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog<BalanceTransferDto>
				entityNameSelector={ () => `"${ t("balanceTransfers.entityName") }"` }
				service={ Services.balanceTransfersApi }
				onSuccess={ (entity) => Cubits.balanceTransfers.delete(entity) }
			/>
		</CrudPage>
	);
}

function Cards()
{
	useSignals();
	const {t} = useTranslation("accounting");

	return (
		<CrudPage.Cards
			cards={ [{
				title: t("balanceTransfers.totalTransfers"),
				data: Cubits.balanceTransfers.count.value.toString(),
				icon: <ArrowRightLeft className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function Table()
{
	useSignals();
	const {t} = useTranslation("accounting");
	if (Cubits.balanceTransfers.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.balanceTransfers.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<BalanceTransferDto>
					data={ Cubits.balanceTransfers.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("balanceTransfers.transferId"), rowStyles: "w-24"},
						{rowBody: t("balanceTransfers.date"), rowStyles: "w-24"},
						{rowBody: t("balanceTransfers.fromAccount"), rowStyles: "w-40"},
						{rowBody: t("balanceTransfers.toAccount"), rowStyles: "w-40"},
						{rowBody: t("balanceTransfers.amount"), rowStyles: "w-32"},
						{rowBody: t("balanceTransfers.description"), rowStyles: "w-48"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportBalanceTransfer,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (
						transfer
					) => [
						{rowBody: `#${ transfer.id }`, rowStyles: ""},
						{rowBody: new Date(transfer.date).toLocaleDateString("en-CA"), rowStyles: ""},
						{rowBody: transfer.fromAccountName ?? "-", rowStyles: "font-semibold text-red-600"},
						{rowBody: transfer.toAccountName ?? "-", rowStyles: "font-semibold text-green-600"},
						{
							rowBody: (
								<div className="flex items-center gap-1">
									{ (transfer.amount ?? 0).toLocaleString("en-US") }
									<ErpCurrencyIcon/>
								</div>
							),
							rowStyles: "font-mono font-bold"
						},
						{
							rowBody: transfer.description ?? "-",
							rowStyles: "text-sm text-gray-500 truncate max-w-[200px]"
						},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportBalanceTransfer,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: (
									<ReportButton
										reportName={ ReportConstants.BalanceTransfer }
										request={ {
											balanceTransferId: transfer.id,
											tafqit: Services.auth.setting?.currency?.value
												? NumbertoWordsService.ConvertAmount(
													transfer.amount,
													Services.auth.setting?.currency.value
												)
												: NumbertoWordsService.Convert(transfer.amount)
										} }
									/>
								),
								rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.BalanceTransfers,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.BalanceTransfers,
						SystemPermissionsActions.Delete
					) }
				/>

				<CrudPage.TablePagination
					pageSize={ Cubits.balanceTransfers.pageSize.value }
					totalNumber={ Cubits.balanceTransfers.count.value }
					currentPage={ Cubits.balanceTransfers.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.balanceTransfers.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.balanceTransfers.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
