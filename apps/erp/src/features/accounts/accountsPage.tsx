import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import type { AccountsListReportRequest } from "@/core/data/report/accountsListReportRequest";
import { Services } from "@/core/services/services";
import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { BoxIcon, WalletIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, CrudPageOld, CurrencyIcon, type IDialogState, type IEntityState, type IFormState, PageCubit, PageError, PageLoaded, PageLoading, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import AccountOld, { AccountSlice, AccountType } from "../../core/data/account";
import ReportConstants from "../../core/data/report/reportConstants";
import AccountsApiServiceOld from "../../core/networking/accountApiServiceOld";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import AccountStatementButtonOld, { AccountStatementButton } from "../reports/accountStatementDialog";
import ReportButton from "../reports/reportButton";
import ChangeAccountDialog from "./changeAccountDialog";
import ChangeAccountDialogOld from "./changeAccountDialogOld";
import { Account, type AccountDto } from "./data/account";

export default function AccountsPageOld({
  title,
  slice,
  fixedType,
  selectEntityState,
  selectDialogState,
  selectFormState,
  hasPagePermission
}: {
  title: string;
  slice: ReturnType<typeof AccountSlice.create>;
  fixedType: AccountType;
  selectEntityState: (state: RootState) => IEntityState<AccountOld>;
  selectDialogState: (state: RootState) => IDialogState<AccountOld>;
  selectFormState: (state: RootState) => IFormState<AccountOld>;
  hasPagePermission: boolean;
})
{
  const { t } = useTranslation("accounting");
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const accountState = useAppSelector(selectEntityState);
  const accountDialogState = useAppSelector(selectDialogState);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Accounts)
  );

  const service = useMemo(() => new AccountsApiServiceOld(), []);

  const canShowBalance = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.AccountShowBalance,
    SystemPermissionsActions.Get
  );

  return (
    <CrudPageOld<AccountOld>
      title={ title }
      entityName={ t("accounts.entityName") }
      addNewItemTitle={ t("accounts.addNewTitle") }
      onSearchTextChange={ setSearchText }
      actionButtons={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.ReportAccountList,
          SystemPermissionsActions.Get
        )
        ? [
          <ReportButton<AccountsListReportRequest>
            reportName={ ReportConstants.AccountsList }
            request={ { type: fixedType, searchText: searchText } }
          />
        ]
        : [] }
      permissions={ permissions }
      hasPagePermission={ hasPagePermission }
      entityState={ accountState }
      useSlice={ () => accountDialogState }
      service={ service }
      cards={ [{
        title: t("accounts.totalAccounts"),
        data: (accountState.entities?.count ?? 0).toString(),
        icon: <WalletIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("accounts.accountId"), rowStyles: "w-24" },
        {
          rowName: t("accounts.accountName"),
          rowStyles: "w-40"
        },
        ...(canShowBalance ? [{ rowName: t("accounts.balance"), rowStyles: "w-32" }] : []),
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportAccountStatement,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : []),
        { rowName: "", rowStyles: "w-32" }
      ] }
      tableRowMapper={ (
        account: AccountOld
      ) =>
      {
        const isCredit = account.balance <= 0;
        const label = isCredit ? t("accounts.debit") : t("accounts.credit");
        const colorStyle = isCredit ? "text-red-600" : "text-green-600";

        return [
          { rowName: `#${account.id}`, rowStyles: "" },
          { rowName: account.name, rowStyles: "font-semibold" },
          ...(canShowBalance
            ? [{
              rowName: (
                <div className="flex items-center gap-1">
                  { Math.abs(account.balance ?? 0).toLocaleString("en-US") }
                  <CurrencyIcon />
                </div>
              ),
              rowStyles: `font-mono ${colorStyle}`
            }, {
              rowName: label,
              rowStyles: `font-semibold ${colorStyle}`
            }]
            : []),
          ...(SystemPermissions.hasAuth(
              authState.loggedInUser?.role?.permissions ?? [],
              SystemPermissionsResources.ReportAccountStatement,
              SystemPermissionsActions.Get
            )
            ? [{
              rowName: <AccountStatementButtonOld account={ account } />,
              rowStyles: "w-32"
            }]
            : [])
        ];
      } }
      actions={ {
        filter: slice.entityActions.filter,
        openChangeDialog: (entity) => slice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => slice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => slice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => slice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: slice.entityActions.refresh,
        setCurrentPage: (page) => slice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeAccountDialogOld
          entity={ accountDialogState.selectedRow || undefined }
          mode={ accountDialogState.selectedRow ? "update" : "create" }
          service={ service }
          slice={ slice }
          selectEntityState={ selectEntityState }
          fixedType={ fixedType }
          selectFormState={ selectFormState }
          onSuccess={ (data, mode) =>
          {
            dispatch(slice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(slice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}

export function AccountsPage(
  { hasPagePermission, title, fixedType }: {
    hasPagePermission: boolean;
    title: string;
    fixedType: AccountType;
  }
)
{
  useSignals();
  const accountCubit = useMemo(() => new PageCubit<Account, AccountDto>(Services.accountsApi), []);
  if (!hasPagePermission)
  {
    return <UnauthorizedPage />;
  }

  const { t } = useTranslation("accounting");
  useEffect(() => accountCubit.init([fixedType]), []);

  // TODO: replace it wuth Cubits.accounts.searchText
  const searchText = useMemo(() => accountCubit.searchText, [accountCubit.searchText]);

  return (
    <CrudPage>
      <CrudPage.Header
        title={ title }
        addButtonTitle={ t("accounts.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add) }
        actionButtons={ Services.auth.hasAuth(
            SystemPermissionsResources.ReportAccountList,
            SystemPermissionsActions.Get
          )
          ? [
            <ReportButton<AccountsListReportRequest>
              reportName={ ReportConstants.AccountsList }
              request={ { type: fixedType, searchText: searchText.value } }
            />
          ]
          : [] }
      />

      <Cards count={ accountCubit.count } />

      <CrudPage.SearchInput onSearch={ (searchText) => accountCubit.search(searchText) } />

      <PageTable cubit={ accountCubit } />

      <CrudPage.ChangeDialog
        changeDialog={ (dto: AccountDto | undefined, closeDialog) =>
        {
          return (
            <ChangeAccountDialog
              entity={ dto
                ? Account.load(dto)
                : Account.create({ type: fixedType }) }
              service={ Services.accountsApi }
              onSuccess={ (data) =>
              {
                if (data.mode.value === "create")
                {
                  accountCubit.add(data);
                  closeDialog();
                }
                else if (data.mode.value === "update")
                {
                  accountCubit.update(data);
                }
              } }
            />
          );
        } }
      />

      <CrudPage.DeleteDialog
        entityNameSelector={ (account) => account.name }
        service={ Services.accountsApi }
        onSuccess={ (entity) => accountCubit.delete(entity) }
      />
    </CrudPage>
  );
}

function Cards({ count }: { count: Signal<number>; })
{
  useSignals();
  const { t } = useTranslation("stocking");
  return (
    <CrudPage.Cards
      cards={ [{
        title: t("units.totalUnits"),
        data: (count.value ?? 0).toString(),
        icon: <BoxIcon className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function PageTable(
  { cubit }: { cubit: PageCubit<Account, AccountDto>; }
)
{
  useSignals();

  const { t } = useTranslation(["accounting", "common"]);

  if (cubit.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  const canShowBalance = Services.auth.hasAuth(
    SystemPermissionsResources.AccountShowBalance,
    SystemPermissionsActions.Get
  );

  if (cubit.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<Account, AccountDto>
          data={ cubit.entities.value }
          headerRows={ [
            { rowBody: "", rowStyles: "text-left w-12.5" },
            { rowBody: t("accounts.accountId"), rowStyles: "w-24" },
            {
              rowBody: t("accounts.accountName"),
              rowStyles: "w-40"
            },
            ...(canShowBalance ? [{ rowBody: t("accounts.balance"), rowStyles: "w-32" }] : []),
            ...(Services.auth.hasAuth(
                SystemPermissionsResources.ReportAccountStatement,
                SystemPermissionsActions.Get
              )
              ? [{ rowBody: "", rowStyles: "w-32" }]
              : []),
            { rowBody: "", rowStyles: "w-32" }
          ] }
          tableRowMapper={ (
            account
          ) =>
          {
            const isCredit = account.balance.value <= 0;
            const label = isCredit ? t("accounts.debit") : t("accounts.credit");
            const colorStyle = isCredit ? "text-red-600" : "text-green-600";

            return [
              { rowBody: `#${account.id}`, rowStyles: "" },
              { rowBody: account.name, rowStyles: "font-semibold" },
              ...(canShowBalance
                ? [{
                  rowBody: (
                    <div className="flex items-center gap-1">
                      { Math.abs(account.balance.value ?? 0).toLocaleString("en-US") }
                      <CurrencyIcon />
                    </div>
                  ),
                  rowStyles: `font-mono ${colorStyle}`
                }, {
                  rowBody: label,
                  rowStyles: `font-semibold ${colorStyle}`
                }]
                : []),
              ...(Services.auth.hasAuth(
                  SystemPermissionsResources.ReportAccountStatement,
                  SystemPermissionsActions.Get
                )
                ? [{
                  rowBody: <AccountStatementButton account={ account } />,
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
          pageSize={ cubit.pageSize.value }
          totalNumber={ cubit.count.value }
          currentPage={ cubit.currentPage.value }
          onPageChanged={ (newPage) =>
          {
            console.log(newPage);

            cubit.changePage(newPage);
          } }
        />
      </CrudPage.Table>
    );
  }

  if (cubit.state.value instanceof PageError)
  {
    return <TablePreview.Error />;
  }

  return <TablePreview.Empty />;
}
