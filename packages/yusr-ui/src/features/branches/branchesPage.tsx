import { useSignals } from "@preact/signals-react/runtime";
import { Building } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage, TablePreview, UnauthorizedPage } from "../../components/custom";
import { type BranchDto } from "../../entities";
import { BaseCubits } from "../../services";
import { BaseServices } from "../../services/baseServices";
import { ChangeableEntityMode, PageError, PageLoaded, PageLoading } from "../../stateManager";
import { ChangeBranchDialog } from "./changeBranchDialog";


export function BranchesPage({onUpdate}: { onUpdate?: (dto: BranchDto) => void; })
{
	const {t} = useTranslation("commonEntities");

	if (!BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Branches, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	useEffect(() =>
	{
		BaseCubits.branches.init();
	}, []);

	return (
		<CrudPage<BranchDto>>
			<CrudPage.Header
				title={ t("branches.title") }
				addButtonTitle={ t("branches.addNewTitle") }
				isAddButtonVisible={ BaseServices.auth.hasAuth(
					YusrSystemPermissionsResources.Branches,
					SystemPermissionsActions.Add
				) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => BaseCubits.branches.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog<BranchDto>
				changeDialog={ (dto, closeDialog) =>
				{
					return (
						<ChangeBranchDialog
							dto={ dto }
							service={ BaseServices.branchesApi }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									BaseCubits.branches.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
								{
									BaseCubits.branches.update(data);
									onUpdate?.(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (entity) => entity.name }
				service={ BaseServices.branchesApi }
				onSuccess={ (entity) => BaseCubits.branches.delete(entity) }
			/>
		</CrudPage>
	);
}

function Cards()
{
	useSignals();
	const {t} = useTranslation("commonEntities");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("branches.totalBranches"),
				data: BaseCubits.branches.count.value.toString(),
				icon: <Building className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["commonEntities", "common"]);

	if (BaseCubits.branches.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (BaseCubits.branches.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<BranchDto>
					data={ BaseCubits.branches.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("branches.branchId"), rowStyles: "w-30"},
						{rowBody: t("branches.branchName"), rowStyles: "w-50"},
						{rowBody: t("branches.city"), rowStyles: "w-50"}
					] }
					tableRowMapper={ (
						branch
					) => [{rowBody: `#${ branch.id }`, rowStyles: ""}, {
						rowBody: branch.name,
						rowStyles: "font-semibold"
					}, {
						rowBody: branch.cityName,
						rowStyles:
							"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
					}] }
					hasUpdatePermission={ BaseServices.auth.hasAuth(
						YusrSystemPermissionsResources.Branches,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ BaseServices.auth.hasAuth(
						YusrSystemPermissionsResources.Branches,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ BaseCubits.branches.pageSize.value }
					totalNumber={ BaseCubits.branches.count.value }
					currentPage={ BaseCubits.branches.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						BaseCubits.branches.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (BaseCubits.branches.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
