import { Services } from "@/core/services/services";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { AccountType } from "@/core/data/account.ts";
import AccountsPage from "./accountsPage";


export function EmployeesAccountsPage()
{
	const {t} = useTranslation("accounting");

	return (
		<AccountsPage
			title={ t("employees.title") }
			fixedType={ AccountType.Employee }
			hasPagePermission={ Services.auth.hasAuth(
				SystemPermissionsResources.AccountEmployee,
				SystemPermissionsActions.Get
			) && Services.auth.hasAuth(
				SystemPermissionsResources.Accounts,
				SystemPermissionsActions.Get
			) }
		/>
	);
}
