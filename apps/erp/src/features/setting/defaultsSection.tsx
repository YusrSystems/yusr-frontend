import { useTranslation } from "react-i18next";
import { CurrenciesSearchableSelect, FieldGroup, FieldsSection, FormField } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import TaxesSearchableSelect from "@/core/components/searchableSelect/taxesSearchableSelect.tsx";
import { type Setting } from "@/core/data/setting.ts";
import { useEffect } from "react";
import { Cubits } from "@/core/services/cubits.ts";


export default function DefaultsSection({formData}: { formData: Setting })
{
	useSignals();
	const {t} = useTranslation(["erpCommon", "accounting"]);

	useEffect(() =>
	{
		Cubits.partners.init();
	}, []);

	return (
		<div className="space-y-8 animate-in fade-in">
			<FieldGroup className="gap-8">
				<FieldsSection title={ t("settings.operationalDefaults", "إعدادات التشغيل الافتراضية") } columns={ 2 }>
					<FormField
						label={ t("settings.defaultCurrency", "العملة الافتراضية") }
						required
						error={ formData.getError("currencyId") }
					>
						<CurrenciesSearchableSelect
							id={ formData.currencyId }
							label={ formData.currency?.value?.name }
						/>
					</FormField>

					<FormField label={ t("settings.defaultTax", "الضريبة الافتراضية") }>
						<TaxesSearchableSelect
							id={ formData.mainTaxId }
							label={ formData.mainTax?.value?.name }
						/>
					</FormField>

					<FormField label={ t("settings.defaultWarehouse", "المستودع الافتراضي") }>
						<StoresSearchableSelect
							id={ formData.mainStoreId }
							label={ formData.mainStoreName }
						/>
					</FormField>

					<FormField label={ t("settings.defaultPaymentMethod", "طريقة الدفع الافتراضية") }>
						<PaymentMethodsSearchableSelect
							id={ formData.mainPaymentMethodId }
							label={ formData.mainPaymentMethodName }
						/>
					</FormField>

					<FormField label={ t("settings.defaultCustomerPartner", "العميل الافتراضي للمبيعات") }>
						<PartnersSearchableSelect
							id={ formData.defaultCustomerPartnerId }
							label={ formData.defaultCustomerPartnerName }
						/>
					</FormField>

					<FormField label={ t("settings.defaultSupplierPartner", "المورد الافتراضي للمشتريات") }>
						<PartnersSearchableSelect
							id={ formData.defaultSupplierPartnerId }
							label={ formData.defaultSupplierPartnerName }
						/>
					</FormField>
				</FieldsSection>

				<FieldsSection
					title={ t("settings.systemAccounts", "الحسابات المحاسبية التلقائية للنظام") }
					columns={ 3 }
				>
					<FormField label={ t("settings.accountsReceivable", "حساب الذمم المدينة") }>
						<AccountsSearchableSelect
							id={ formData.receivablesAccountId }
							label={ formData.receivablesAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.accountsPayable", "حساب الذمم الدائنة") }>
						<AccountsSearchableSelect
							id={ formData.payablesAccountId }
							label={ formData.payablesAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.salesRevenue", "حساب إيرادات المبيعات") }>
						<AccountsSearchableSelect
							id={ formData.salesRevenueAccountId }
							label={ formData.salesRevenueAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.cogs", "حساب تكلفة البضاعة المباعة") }>
						<AccountsSearchableSelect
							id={ formData.cogsAccountId }
							label={ formData.cogsAccountName }
						/>
					</FormField>

					<FormField
						label={ t("settings.openingBalanceEquity", "حساب تسوية قيمة المخزون") }
					>
						<AccountsSearchableSelect
							id={ formData.inventoryAdjustmentAccountId }
							label={ formData.inventoryAdjustmentAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.inventoryAsset", "حساب مخزون المستودع") }>
						<AccountsSearchableSelect
							id={ formData.inventoryAssetAccountId }
							label={ formData.inventoryAssetAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.outputTax", "حساب ضريبة المخرجات") }>
						<AccountsSearchableSelect
							id={ formData.outputTaxAccountId }
							label={ formData.outputTaxAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.inputTax", "حساب ضريبة المدخلات") }>
						<AccountsSearchableSelect
							id={ formData.inputTaxAccountId }
							label={ formData.inputTaxAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.paymentCommission", "حساب عمولات ورسوم الدفع الإلكتروني") }>
						<AccountsSearchableSelect
							id={ formData.paymentCommissionAccountId }
							label={ formData.paymentCommissionAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.purchaseExpense", "حساب مصروفات شراء الخدمات") }>
						<AccountsSearchableSelect
							id={ formData.purchaseExpenseAccountId }
							label={ formData.purchaseExpenseAccountName }
						/>
					</FormField>

					<FormField label={ t("settings.openingBalanceEquity", "حساب الأرصدة الافتتاحية") }>
						<AccountsSearchableSelect
							id={ formData.openingBalanceEquityAccountId }
							label={ formData.openingBalanceEquityAccountName }
						/>
					</FormField>

					<FormField label="حساب الأرباح والخسائر المبقاة (المرحلة)">
						<AccountsSearchableSelect
							id={ formData.retainedEarningsAccountId }
							label={ formData.retainedEarningsAccountName }
						/>
					</FormField>

					<FormField label="حساب المصروفات المدفوعة مقدماً">
						<AccountsSearchableSelect
							id={ formData.prepaidExpenseAccountId }
							label={ formData.prepaidExpenseAccountName }
						/>
					</FormField>

					<FormField label="حساب الإيرادات المؤجلة غير المكتسبة">
						<AccountsSearchableSelect
							id={ formData.deferredRevenueAccountId }
							label={ formData.deferredRevenueAccountName }
						/>
					</FormField>

					<FormField label="حساب عجز وزيادة الصندوق">
						<AccountsSearchableSelect
							id={ formData.posCashVarianceAccountId }
							label={ formData.posCashVarianceAccountName }
						/>
					</FormField>
				</FieldsSection>
			</FieldGroup>
		</div>
	);
}