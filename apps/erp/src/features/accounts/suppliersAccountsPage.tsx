import { Services } from "@/core/services/services";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { AccountType } from "@/core/data/account.ts";
import AccountsPage from "./accountsPage";


export function SuppliersAccountsPage()
{
	const {t} = useTranslation("accounting");

	return (
		<AccountsPage
			title={ t("suppliers.title") }
			fixedType={ AccountType.Supplier }
			hasPagePermission={ Services.auth.hasAuth(
				SystemPermissionsResources.AccountSupplier,
				SystemPermissionsActions.Get
			) && Services.auth.hasAuth(
				SystemPermissionsResources.Accounts,
				SystemPermissionsActions.Get
			) }
		/>
	);
}
