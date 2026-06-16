import ReportConstants from "@/core/data/report/reportConstants";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowLeftRightIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    CrudPage,
    PageError,
    PageLoaded,
    PageLoading,
    SystemPermissionsActions,
    TablePreview,
    UnauthorizedPage
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import ItemTransfer, { ItemTransferDto } from "../../core/data/itemTransfer";
import ReportButton from "../reports/reportButton";
import ChangeItemTransferDialog from "./changeItemTransferDialog";


export default function ItemTransfersPage()
{
	const {t} = useTranslation(["stocking", "common"]);
	useEffect(() => Cubits.itemTransfers.init(), []);
	if (!Services.auth.hasAuth(SystemPermissionsResources.ItemTransfers, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage>
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

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: ItemTransferDto | undefined, closeDialog) =>
				{
					return (
						<ChangeItemTransferDialog
							entity={ dto
								? ItemTransfer.load(dto)
								: ItemTransfer.create() }
							service={ Services.itemTransfersApi }
							onSuccess={ (data) =>
							{
								if (data.mode.value === "create")
								{
									Cubits.itemTransfers.add(data);
									closeDialog();
								}
								else if (data.mode.value === "update")
								{
									Cubits.itemTransfers.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (itemTransfer) => itemTransfer.id }
				service={ Services.itemTransfersApi }
				onSuccess={ (entity) => Cubits.itemTransfers.delete(entity) }
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
				title: t("itemTransfers.totalTransfers"),
				data: Cubits.itemTransfers.count.value.toString(),
				icon: <ArrowLeftRightIcon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
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
				<CrudPage.TableBody<ItemTransfer, ItemTransferDto>
					data={ Cubits.itemTransfers.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "w-12"},
						{rowBody: t("itemTransfers.transferId"), rowStyles: "w-24"},
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
						{rowBody: `#${ transfer.id.value }`},
						{rowBody: new Date(transfer.transferDate.value).toLocaleDateString("en-CA"), rowStyles: ""},
						{rowBody: transfer.fromStoreName.value, rowStyles: "font-semibold"},
						{rowBody: transfer.toStoreName.value, rowStyles: "font-semibold"},
						{rowBody: transfer.description.value || "-", rowStyles: "text-muted-foreground"},
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportItemTransfer,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: (
									<ReportButton
										reportName={ ReportConstants.ItemTransfer }
										request={ {itemTransferId: transfer.id.value} }
									/>
								),
								rowStyles: "w-32"
							}]
							: [])
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.ItemTransfers,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.ItemTransfers,
						SystemPermissionsActions.Delete
					) }
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
