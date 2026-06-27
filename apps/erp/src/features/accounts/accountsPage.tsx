import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import type { AccountsListReportRequest } from "@/core/data/report/accountsListReportRequest";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { WalletIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	CrudPage,
	FilterSection,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TableHeaderActionButtons,
	TablePreview,
	UnauthorizedPage,
	YoutubeButton
} from "yusr-ui";
import { Account, type AccountDto, type AccountType } from "@/core/data/account.ts";
import ReportConstants from "../../core/data/report/reportConstants";
import { AccountStatementButton } from "../reports/accountStatementDialog";
import ReportButton from "../reports/reportButton";
import ChangeAccountDialog from "./changeAccountDialog";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export default function AccountsPage(
	{hasPagePermission, title, fixedType}: {
		hasPagePermission: boolean;
		title: string;
		fixedType: AccountType;
	}
)
{
	useSignals();
	const {t} = useTranslation("accounting");
	useEffect(() => Cubits.accounts.init([fixedType]), [fixedType]);
	const searchText = useMemo(() => Cubits.accounts.searchText, []);

	if (!hasPagePermission)
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage>
			<CrudPage.HeaderContainer>
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 ">
					<h1>
						{ title }
					</h1>

					<YoutubeButton/>
				</div>

				<CrudPage.HeaderButtonsContainer>
					<TableHeaderActionButtons actionButtons={
						Services.auth.hasAuth(
							SystemPermissionsResources.ReportAccountList,
							SystemPermissionsActions.Get
						)
							? [
								<ReportButton<AccountsListReportRequest>
									reportName={ ReportConstants.AccountsList }
									request={ {type: fixedType, searchText: searchText.value} }
								/>
							] : []
					}/>


					{ Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add) && (
						<CrudPage.AddButton title={ t("accounts.addNewTitle") }/>
					) }
				</CrudPage.HeaderButtonsContainer>
			</CrudPage.HeaderContainer>

			<Cards count={ Cubits.accounts.count }/>

			<div className="mb-5">

			</div>

			<FilterSection
				fieldsCubit={ Cubits.accountFilterFields }
				onApply={ (groups) => Cubits.accounts.applyFilterGroups(groups) }
				onClear={ () => Cubits.accounts.clearFilterGroups() }
			/>

			<CrudPage.SearchInput
				className="rounded-t-none!"
				onSearch={ (searchText) => Cubits.accounts.search(searchText) }
			/>

			<PageTable/>

			<CrudPage.ChangeDialog
				changeDialog={ (dto: AccountDto | undefined, closeDialog) =>
				{
					return (
						<ChangeAccountDialog
							entity={ dto
								? Account.load(dto)
								: Account.create({type: fixedType}) }
							service={ Services.accountsApi }
							onSuccess={ (data) =>
							{
								if (data.mode.value === ChangeableEntityMode.Create)
								{
									Cubits.accounts.add(data);
									closeDialog();
								}
								else if (data.mode.value === ChangeableEntityMode.Update)
								{
									Cubits.accounts.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (account) => account.name }
				service={ Services.accountsApi }
				onSuccess={ (entity) => Cubits.accounts.delete(entity) }
			/>
		</CrudPage>
	);
}

function Cards({count}: { count: Signal<number>; })
{
	useSignals();
	const {t} = useTranslation("accounting");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("accounts.totalAccounts"),
				data: (count.value ?? 0).toString(),
				icon: <WalletIcon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();

	const {t} = useTranslation(["accounting", "common"]);

	if (Cubits.accounts.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	const canShowBalance = Services.auth.hasAuth(
		SystemPermissionsResources.AccountShowBalance,
		SystemPermissionsActions.Get
	);

	const balanceLabels: Record<"debit" | "credit" | "zero", string> = {
		debit: t("accounts.debit"),
		credit: t("accounts.credit"),
		zero: ""
	};

	if (Cubits.accounts.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<Account, AccountDto>
					data={ Cubits.accounts.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("accounts.accountId"), rowStyles: "w-24"},
						{
							rowBody: t("accounts.accountName"),
							rowStyles: "w-40"
						},
						...(canShowBalance ? [{rowBody: t("accounts.balance"), rowStyles: "w-32"}] : []),
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportAccountStatement,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: []),
						{rowBody: "", rowStyles: "w-32"}
					] }
					tableRowMapper={ (
						account
					) =>
					{
						const balanceType = account.balance.value > 0 ? "debit" : account.balance.value < 0 ? "credit" : "zero";
						const balanceLabel = balanceLabels[balanceType];
						const colorStyle = balanceType === "credit" ? "text-red-600" : "text-green-600";

						return [
							{rowBody: `#${ account.id }`, rowStyles: ""},
							{rowBody: account.name, rowStyles: "font-semibold"},
							...(canShowBalance
								? [{
									rowBody: (
										<div className="flex items-center gap-1">
											{ Math.abs(account.balance.value ?? 0).toLocaleString("en-US") }
											<ErpCurrencyIcon/>
										</div>
									),
									rowStyles: `font-mono ${ colorStyle }`
								}, {
									rowBody: balanceLabel,
									rowStyles: `font-semibold ${ colorStyle }`
								}]
								: []),
							...(Services.auth.hasAuth(
								SystemPermissionsResources.ReportAccountStatement,
								SystemPermissionsActions.Get
							)
								? [{
									rowBody: <AccountStatementButton account={ account }/>,
									rowStyles: "w-32"
								}]
								: [])
						];
					} }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Accounts,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Accounts,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.accounts.pageSize.value }
					totalNumber={ Cubits.accounts.count.value }
					currentPage={ Cubits.accounts.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.accounts.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.accounts.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
