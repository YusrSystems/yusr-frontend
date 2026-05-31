import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import type { AccountsListReportRequest } from "@/core/data/report/accountsListReportRequest";
import { WalletIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CrudPageOld, CurrencyIcon, type IDialogState, type IEntityState, type IFormState, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import Account, { AccountSlice, AccountType } from "../../core/data/account";
import ReportConstants from "../../core/data/report/reportConstants";
import AccountsApiService from "../../core/networking/accountApiService";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import AccountStatementButton from "../reports/accountStatementDialog";
import ReportButton from "../reports/reportButton";
import ChangeAccountDialog from "./changeAccountDialog";

export default function AccountsPage({
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
  selectEntityState: (state: RootState) => IEntityState<Account>;
  selectDialogState: (state: RootState) => IDialogState<Account>;
  selectFormState: (state: RootState) => IFormState<Account>;
  hasPagePermission: boolean;
}) {
  const { t } = useTranslation("accounting");
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const accountState = useAppSelector(selectEntityState);
  const accountDialogState = useAppSelector(selectDialogState);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Accounts)
  );

  const service = useMemo(() => new AccountsApiService(), []);

  const canShowBalance = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.AccountShowBalance,
    SystemPermissionsActions.Get
  );

  return (
    <CrudPageOld<Account>
      title={title}
      entityName={t("accounts.entityName")}
      addNewItemTitle={t("accounts.addNewTitle")}
      onSearchTextChange={setSearchText}
      actionButtons={SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportAccountList,
        SystemPermissionsActions.Get
      )
        ? [
          <ReportButton<AccountsListReportRequest>
            reportName={ReportConstants.AccountsList}
            request={{ type: fixedType, searchText: searchText }}
          />
        ]
        : []}
      permissions={permissions}
      hasPagePermission={hasPagePermission}
      entityState={accountState}
      useSlice={() => accountDialogState}
      service={service}
      cards={[{
        title: t("accounts.totalAccounts"),
        data: (accountState.entities?.count ?? 0).toString(),
        icon: <WalletIcon className="h-4 w-4 text-muted-foreground" />
      }]}
      tableHeadRows={[
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
      ]}
      tableRowMapper={(
        account: Account
      ) => {
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
                  {Math.abs(account.balance ?? 0).toLocaleString("en-US")}
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
              rowName: <AccountStatementButton account={account} />,
              rowStyles: "w-32"
            }]
            : [])
        ];
      }}
      actions={{
        filter: slice.entityActions.filter,
        openChangeDialog: (entity) => slice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => slice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => slice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => slice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: slice.entityActions.refresh,
        setCurrentPage: (page) => slice.entityActions.setCurrentPage(page)
      }}
      ChangeDialog={
        <ChangeAccountDialog
          entity={accountDialogState.selectedRow || undefined}
          mode={accountDialogState.selectedRow ? "update" : "create"}
          service={service}
          slice={slice}
          selectEntityState={selectEntityState}
          fixedType={fixedType}
          selectFormState={selectFormState}
          onSuccess={(data, mode) => {
            dispatch(slice.entityActions.refresh({ data: data }));
            if (mode === "create") {
              dispatch(slice.dialogActions.setIsChangeDialogOpen(false));
            }
          }}
        />
      }
    />
  );
}
