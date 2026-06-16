import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { AccountType } from "@/core/data/account.ts";
import AccountsPage from "./accountsPage";


export default function BoxesAccountsPage()
{
	useSignals();
	const {t} = useTranslation("accounting");
	return (
		<AccountsPage
			fixedType={ AccountType.Box }
			title={ t("boxes.title") }
			hasPagePermission={ Services.auth.hasAuth(
				SystemPermissionsResources.AccountBox,
				SystemPermissionsActions.Get
			) && Services.auth.hasAuth(
				SystemPermissionsResources.Accounts,
				SystemPermissionsActions.Get
			) }
		/>
	);
}
