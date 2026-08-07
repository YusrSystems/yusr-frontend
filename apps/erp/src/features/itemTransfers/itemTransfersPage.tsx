import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowLeftRightIcon, Printer } from "lucide-react";
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
import { ItemTransferDto } from "@/core/data/itemTransfer.ts";
import ChangeItemTransferDialog from "./changeItemTransferDialog";
import { signal } from "@preact/signals-react";
import { ItemTransferReport } from "@/features/reports/itemsTransfer/itemTransferReport.tsx";
import { createPortal } from "react-dom";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { APP_NAME } from "../../../appConfig.ts";
import { getTransactionStatusColor, getTransactionStatusName, TransactionStatus } from "@/core/types/transactionStatus";


export default function ItemTransfersPage()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	useEffect(() => Cubits.itemTransfers.init(), []);

	useEffect(() =>
	{
		document.title = `${ t("itemTransfers.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	const printedTransfer = useMemo(() => signal<ItemTransferDto | undefined>(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.ItemTransfers, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
			<CrudPage<ItemTransferDto>>
				<CrudPage.Header
					title={ t("itemTransfers.title") }
					addButtonTitle={ t("itemTransfers.addNewTitle") }
					isAddButtonVisible={ Services.auth.hasAuth(
						SystemPermissionsResources.ItemTransfers,
						SystemPermissionsActions.Add
					) }
				/>

				<Cards/>

				<CrudPage.SearchInput onSearch={ (searchText) => Cubits.itemTransfers.search(searchText) }/>

				<PageTable onPrint={ (transfer) =>
				{
					printedTransfer.value = transfer;
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
						const result = await Services.itemTransfersApi.Get(id);
						return result.data;
					} }
					changeDialog={ (dto: ItemTransferDto | undefined, closeDialog) =>
					{
						return (
							<ChangeItemTransferDialog
								dto={ dto }
								service={ Services.itemTransfersApi }
								onSuccess={ (data, mode) =>
								{
									if (mode === ChangeableEntityMode.Create)
									{
										Cubits.itemTransfers.add(data);
										closeDialog();
									}
									else if (mode === ChangeableEntityMode.Update)
									{
										Cubits.itemTransfers.update(data);
									}
								} }
							/>
						);
					} }
				/>

				<CrudPage.DeleteDialog
					entityNameSelector={ () => `"${ t("itemTransfers.entityName") }"` }
					service={ Services.itemTransfersApi }
					onSuccess={ (entity) => Cubits.itemTransfers.delete(entity) }
				/>
			</CrudPage>

			{ createPortal(
				<PortalReportContainer>
					<ItemTransferReport itemTransfer={ printedTransfer.value }/>
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
				title: t("itemTransfers.totalTransfers"),
				data: Cubits.itemTransfers.count.value.toString(),
				icon: <ArrowLeftRightIcon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable({onPrint}: { onPrint: (transfer: ItemTransferDto) => void })
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (Cubits.itemTransfers.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.itemTransfers.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<ItemTransferDto>
					isShareablePage={ true }
					data={ Cubits.itemTransfers.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "w-12"},
						{rowBody: t("itemTransfers.transferId"), rowStyles: "w-24"},
						{rowBody: t("common:status.title", "الحالة"), rowStyles: "w-24"},
						{rowBody: t("itemTransfers.date"), rowStyles: "w-32"},
						{rowBody: t("itemTransfers.fromStore"), rowStyles: "w-48"},
						{rowBody: t("itemTransfers.toStore"), rowStyles: "w-48"},
						{rowBody: t("itemTransfers.description"), rowStyles: ""},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemTransfer,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (
						transfer
					) => [
						{rowBody: `#${ transfer.id }`},
						{
							rowBody: (
								<span
									className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ getTransactionStatusColor(transfer.transactionStatus) }` }>
									{ getTransactionStatusName(transfer.transactionStatus) }
								</span>
							),
							rowStyles: ""
						},
						{rowBody: transfer.date, rowStyles: ""},
						{rowBody: transfer.fromStoreName, rowStyles: "font-semibold"},
						{rowBody: transfer.toStoreName, rowStyles: "font-semibold"},
						{rowBody: transfer.description || "-", rowStyles: "text-muted-foreground"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemTransfer,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: (
									<Button
										onClick={ () => onPrint(transfer) }
									>
										<Printer className="h-4 w-4"/>
									</Button>
								),
								rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.ItemTransfers,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ (transfer) =>
						transfer.transactionStatus !== TransactionStatus.Voided &&
						Services.auth.hasAuth(
							SystemPermissionsResources.ItemTransfers,
							SystemPermissionsActions.Delete
						)
					}
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.itemTransfers.pageSize.value }
					totalNumber={ Cubits.itemTransfers.count.value }
					currentPage={ Cubits.itemTransfers.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.itemTransfers.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.itemTransfers.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}