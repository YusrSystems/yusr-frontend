import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { AccountType } from "@/core/data/account.ts";
import AccountsPage from "./accountsPage";


export default function BanksAccountsPage()
{
	useSignals();
	const {t} = useTranslation("accounting");
	return (
		<AccountsPage
			title={ t("banks.title") }
			fixedType={ AccountType.Bank }
			hasPagePermission={ Services.auth.hasAuth(
				SystemPermissionsResources.AccountBank,
				SystemPermissionsActions.Get
			) && Services.auth.hasAuth(
				SystemPermissionsResources.Accounts,
				SystemPermissionsActions.Get
			) }
		/>
	);
}
