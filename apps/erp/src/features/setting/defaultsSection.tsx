import { useTranslation } from "react-i18next";
import { FieldGroup, FieldsSection } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import type { Setting } from "@/core/data/setting.ts";


export default function DefaultsSection({formData}: { formData: Setting })
{
	useSignals();
	const {t} = useTranslation("erpCommon");
	return (
		<div className="space-y-10 animate-in fade-in">
			<FieldGroup>
				<FieldsSection title={ t("settings.defaultAccountsAndWarehouses") } columns={ 2 }>
					<div className="flex flex-col gap-1.5 w-full">
						<label className="text-sm font-medium">{ t("settings.defaultWarehouse") }</label>

						<StoresSearchableSelect
							id={ formData.mainStoreId }
							label={ formData.mainStoreName }
						/>
					</div>

					<div className="flex flex-col gap-1.5 w-full">
						<label className="text-sm font-medium">{ t("settings.defaultPaymentMethod") }</label>
						<PaymentMethodsSearchableSelect
							id={ formData.mainPaymentMethodId }
							label={ formData.mainPaymentMethodName }
						/>
					</div>

					<div className="flex flex-col gap-1.5 w-full">
						<label className="text-sm font-medium">{ t("settings.defaultSalesAccount") }</label>
						<AccountsSearchableSelect
							id={ formData.sellAccountId }
							label={ formData.sellAccountName }
							types={ [AccountType.Client, AccountType.Supplier] }
						/>
					</div>

					<div className="flex flex-col gap-1.5 w-full">
						<label className="text-sm font-medium">{ t("settings.defaultPurchaseAccount") }</label>
						<AccountsSearchableSelect
							id={ formData.purchaseAccountId }
							label={ formData.purchaseAccountName }
							types={ [AccountType.Client, AccountType.Supplier] }
						/>
					</div>
				</FieldsSection>
			</FieldGroup>
		</div>
	);
}
