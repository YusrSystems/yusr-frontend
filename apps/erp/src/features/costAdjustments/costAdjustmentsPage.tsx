import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { type CostAdjustmentDto } from "@/core/data/costAdjustment";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Calculator } from "lucide-react";
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
import ChangeCostAdjustmentDialog from "./changeCostAdjustmentDialog";


export default function CostAdjustmentsPage()
{
	const {t} = useTranslation("stocking");
	useEffect(() => Cubits.costAdjustments.init(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.CostAdjustments, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<CostAdjustmentDto>>
			<CrudPage.Header
				title={ t("costAdjustments.title") }
				addButtonTitle={ t("costAdjustments.addNewTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.CostAdjustments, SystemPermissionsActions.Add) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.costAdjustments.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: CostAdjustmentDto | undefined, closeDialog) =>
				{
					return (
						<ChangeCostAdjustmentDialog
							dto={ dto }
							service={ Services.costAdjustmentsApi }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									Cubits.costAdjustments.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
								{
									Cubits.costAdjustments.update(data);
								}
							} }
						/>
					);
				} }
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
				title: t("costAdjustments.totalAdjustments"),
				data: Cubits.costAdjustments.count.value.toString(),
				icon: <Calculator className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (Cubits.costAdjustments.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.costAdjustments.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<CostAdjustmentDto>
					hasDeletePermission={ false }
					data={ Cubits.costAdjustments.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("costAdjustments.adjustmentId"), rowStyles: "w-24"},
						{rowBody: t("costAdjustments.date"), rowStyles: "w-32"},
						{rowBody: t("costAdjustments.item"), rowStyles: "w-48"},
						{rowBody: t("costAdjustments.quantity"), rowStyles: "w-24"},
						{rowBody: t("costAdjustments.oldCost"), rowStyles: "w-32"},
						{rowBody: t("costAdjustments.newCost"), rowStyles: "w-32"},
						{rowBody: t("costAdjustments.notes"), rowStyles: ""}
					] }
					tableRowMapper={ (
						adjustment
					) => [
						{rowBody: `#${ adjustment.id }`, rowStyles: ""},
						{rowBody: adjustment.date, rowStyles: ""},
						{rowBody: adjustment.itemName, rowStyles: "font-semibold"},
						{rowBody: adjustment.quantity.toString(), rowStyles: "font-mono"},
						{
							rowBody: (
								<div className="flex items-center gap-1 text-muted-foreground line-through">
									{ Number(adjustment.oldCost).toLocaleString("en-US") }
									<ErpCurrencyIcon/>
								</div>
							),
							rowStyles: ""
						},
						{
							rowBody: (
								<div className="flex items-center gap-1 font-bold text-blue-600">
									{ Number(adjustment.newCost).toLocaleString("en-US") }
									<ErpCurrencyIcon/>
								</div>
							),
							rowStyles: ""
						},
						{rowBody: adjustment.notes || "-", rowStyles: "text-sm text-gray-500"}
					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.CostAdjustments,
						SystemPermissionsActions.Update
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.costAdjustments.pageSize.value }
					totalNumber={ Cubits.costAdjustments.count.value }
					currentPage={ Cubits.costAdjustments.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.costAdjustments.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.costAdjustments.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}