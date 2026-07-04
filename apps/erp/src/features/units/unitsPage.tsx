import type { UnitDto } from "@/core/data/unit";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { BoxIcon } from "lucide-react";
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
import ChangeUnitDialog from "./changeUnitDialog";


export default function UnitsPage()
{
	const {t} = useTranslation("stocking");
	useEffect(() => Cubits.units.init(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<UnitDto>>
			<CrudPage.Header
				title={ t("units.title") }
				addButtonTitle={ t("units.addNewTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.units.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: UnitDto | undefined, closeDialog) =>
				{
					return (
						<ChangeUnitDialog
							dto={ dto }
							service={ Services.unitsApi }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									Cubits.units.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
								{
									Cubits.units.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (unit) => unit.name }
				service={ Services.unitsApi }
				onSuccess={ (entity) => Cubits.units.delete(entity) }
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
				title: t("units.totalUnits"),
				data: (Cubits.units.count.value ?? 0).toString(),
				icon: <BoxIcon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	if (Cubits.units.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.units.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<UnitDto>
					data={ Cubits.units.entities.value }
					headerRows={ [{rowBody: "", rowStyles: "text-left w-12.5"}, {
						rowBody: t("units.unitId"),
						rowStyles: "w-30"
					}, {rowBody: t("units.unitName"), rowStyles: "w-70"}] }
					tableRowMapper={ (
						unit
					) => [{rowBody: `#${ unit.id }`, rowStyles: ""}, {rowBody: unit.name, rowStyles: "font-semibold"}] }
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
					pageSize={ Cubits.units.pageSize.value }
					totalNumber={ Cubits.units.count.value }
					currentPage={ Cubits.units.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.units.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.units.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
