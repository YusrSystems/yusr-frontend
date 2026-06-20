import { useSignals } from "@preact/signals-react/runtime";
import { User2Icon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage, TablePreview, UnauthorizedPage } from "../../components/custom";
import { User, UserDto } from "../../entities";
import { BaseCubits, BaseServices } from "../../services";
import { ChangeableEntityMode, PageError, PageLoaded, PageLoading } from "../../stateManager";
import { ChangeUserDialog } from "./changeUserDialog";


export function UsersPage()
{
	if (!BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Users, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	const {t} = useTranslation("commonEntities");
	useEffect(() =>
	{
		BaseCubits.users.init();
	}, []);

	return (
		<CrudPage>
			<CrudPage.Header
				title={ t("users.title") }
				addButtonTitle={ t("users.addNewTitle") }
				isAddButtonVisible={ BaseServices.auth.hasAuth(
					YusrSystemPermissionsResources.Users,
					SystemPermissionsActions.Add
				) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => BaseCubits.users.search(searchText) }/>

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: UserDto | undefined, closeDialog) =>
				{
					return (
						<ChangeUserDialog
							entity={ dto
								? User.load(dto)
								: User.create() }
							service={ BaseServices.usersApi }
							onSuccess={ (data) =>
							{
								if (data.mode.value === ChangeableEntityMode.Create)
								{
									BaseCubits.users.add(data);
									closeDialog();
								}
								else if (data.mode.value === ChangeableEntityMode.Update)
								{
									BaseCubits.users.update(data);
									BaseServices.auth.setLoggedInUser(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (entity) => entity.username }
				service={ BaseServices.usersApi }
				onSuccess={ (entity) => BaseCubits.users.delete(entity) }
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
				title: t("users.totalUsers"),
				data: (BaseCubits.users.count.value ?? 0).toString(),
				icon: <User2Icon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["commonEntities", "common"]);

	if (BaseCubits.users.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (BaseCubits.users.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<User, UserDto>
					data={ BaseCubits.users.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("users.userId"), rowStyles: "w-30"},
						{rowBody: t("users.username"), rowStyles: "w-70"},
						{rowBody: t("users.isActive"), rowStyles: ""}
					] }
					tableRowMapper={ (
						user
					) => [{rowBody: `#${ user.id.value }`, rowStyles: ""}, {
						rowBody: user.username.value,
						rowStyles: "font-semibold"
					}, {
						rowBody: user.isActive.value ? t("users.active") : t("users.inactive"),
						rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
							user.isActive.value ? "bg-green-300" : "bg-red-300"
						} text-slate-800`
					}] }
					hasUpdatePermission={ BaseServices.auth.hasAuth(
						YusrSystemPermissionsResources.Users,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ BaseServices.auth.hasAuth(
						YusrSystemPermissionsResources.Users,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ BaseCubits.users.pageSize.value }
					totalNumber={ BaseCubits.users.count.value }
					currentPage={ BaseCubits.users.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						BaseCubits.users.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (BaseCubits.users.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
