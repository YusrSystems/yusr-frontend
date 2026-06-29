import { useTranslation } from "react-i18next";
import { CurrenciesSearchableSelect, FieldGroup, FieldsSection, FormField } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { AccountType } from "@/core/data/account.ts";
import { type Setting } from "@/core/data/setting.ts";
import TaxesSearchableSelect from "@/core/components/searchableSelect/taxesSearchableSelect.tsx";


export default function DefaultsSection({formData}: { formData: Setting })
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	return (
		<div className="space-y-10 animate-in fade-in">
			<FieldGroup>
				<FieldsSection title={ t("settings.defaultValues") } columns={ 2 }>

					<FormField
						label={ t("settings.defaultCurrency") }
						required
						error={ formData.getError("currencyId") }
					>
						<CurrenciesSearchableSelect
							id={ formData.currencyId }
							label={ formData.currency?.value?.name }
						/>

					</FormField>

					<FormField label={ t("settings.defaultTax") }>
						<TaxesSearchableSelect
							id={ formData.mainTaxId }
							label={ formData.mainTax?.value?.name }
						/>
					</FormField>

					<FormField label={ t("settings.defaultWarehouse") }>
						<StoresSearchableSelect
							id={ formData.mainStoreId }
							label={ formData.mainStoreName }
						/>
					</FormField>

					<FormField label={ t("settings.defaultPaymentMethod") }>
						<PaymentMethodsSearchableSelect
							id={ formData.mainPaymentMethodId }
							label={ formData.mainPaymentMethodName }
						/>
					</FormField>

					<FormField label={ t("settings.defaultSalesAccount") }>
						<AccountsSearchableSelect
							id={ formData.sellAccountId }
							label={ formData.sellAccountName }
							types={ [AccountType.Client, AccountType.Supplier] }
						/>
					</FormField>

					<FormField label={ t("settings.defaultPurchaseAccount") }>
						<AccountsSearchableSelect
							id={ formData.purchaseAccountId }
							label={ formData.purchaseAccountName }
							types={ [AccountType.Client, AccountType.Supplier] }
						/>
					</FormField>
				</FieldsSection>
			</FieldGroup>
		</div>
	);
}
