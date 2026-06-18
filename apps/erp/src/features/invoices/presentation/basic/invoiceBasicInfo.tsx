import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckboxField, DateField, FieldsSection, FormField, SelectField, TextField } from "yusr-ui";
import Invoice, { InvoiceMode } from "@/core/data/invoices/invoice.ts";
import { signal, useComputed } from "@preact/signals-react";
import { type Account, AccountType } from "@/core/data/account.ts";
import { Services } from "@/core/services/services.ts";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import AccountsSearchableSelect from "@/core/components/searchableSelect/accountsSearchableSelect.tsx";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { ImportExportType } from "@/core/types/importExportType.ts";
import { useSignals } from "@preact/signals-react/runtime";


export default function InvoiceBasicInfo({invoice}: { invoice: Invoice })
{
	useSignals();
	const {t} = useTranslation("accounting");
	const selectedAccount = useMemo(() => signal<Account | undefined>(), []);

	const invoiceOrigin = useComputed(() =>
	{
		const accountCountryId = selectedAccount.value?.city.value?.countryId.value;
		const settingsCountryId = Services.auth.setting?.branch?.value?.city.value?.countryId.value;

		if (accountCountryId == undefined || settingsCountryId == undefined)
		{
			return {canBeExportInvoice: false, canBeImportInvoice: false};
		}

		const isCrossBorder = accountCountryId !== settingsCountryId;

		return {
			canBeExportInvoice: isCrossBorder
				&& (invoice.type.value === InvoiceType.Sell || invoice.type.value === InvoiceType.PurchaseReturn || invoice.type.value === InvoiceType.Quotation),

			canBeImportInvoice: isCrossBorder
				&& (invoice.type.value === InvoiceType.Purchase || invoice.type.value === InvoiceType.SellReturn)
		};
	});

	useEffect(() =>
	{
		if (invoiceOrigin.value.canBeExportInvoice)
		{
			invoice.importExportType.value = ImportExportType.Export;
		}
		else if (invoiceOrigin.value.canBeImportInvoice)
		{
			invoice.importExportType.value = ImportExportType.ImportAccordingToTheReverseChargeMechanism;
		}
		else
		{
			invoice.importExportType.value = undefined;
		}
	}, [invoice.importExportType, invoiceOrigin.value]);

	const isPurchaseInvoice = () =>
		invoice.type.value === InvoiceType.Purchase || invoice.type.value === InvoiceType.PurchaseReturn;

	return (
		<FieldsSection columns={ {base: 1, md: 2, lg: 4} }>

			<DateField
				label={ t("invoices.invoiceDate") }
				required
				value={ invoice.date }
				error={ invoice.getError("date") }
				disabled={ invoice.mode.value === InvoiceMode.Update || invoice.mode.value === InvoiceMode.Return }
			/>

			<FormField
				label={ t("invoices.store") }
				required
				error={ invoice.getError("storeId") }
			>
				<StoresSearchableSelect
					id={ invoice.storeId }
					label={ invoice.storeName }
					disabled={ invoice.isDisabled }
					onSelect={ () =>
					{
						invoice.invoiceItems.value = [];
						invoice.invoiceVouchers.value = [];
					} }
				/>
			</FormField>

			<FormField
				label={ t("invoices.account") }
				required
				error={ invoice.getError("actionAccountId") }
			>
				<AccountsSearchableSelect
					id={ invoice.actionAccountId }
					label={ invoice.actionAccountName }
					disabled={ invoice.isDisabled }
					types={ isPurchaseInvoice() ? [AccountType.Supplier] : [AccountType.Client] }
					onSelect={ (account) =>
					{
						selectedAccount.value = account;
					} }
				/>
			</FormField>

			<TextField
				label={ t("invoices.relatedInvoiceNumber") }
				disabled
				value={ invoice.originalInvoiceId }
			/>

			{
				/* <TextField
				 label={ t("invoices.delegateEmployee") }
				 value={ formData.delegateEmp || "" }
				 onChange={ (e) => dispatch(slice.formActions.updateFormData({ delegateEmp: e.target.value })) }
				 /> */
			}

			{ invoiceOrigin.value.canBeExportInvoice && (
				<SelectField<ImportExportType>
					label={ t("invoices.importInvoice") }
					required
					disabled={ invoice.mode.value === InvoiceMode.Return }
					value={ invoice.importExportType }
					error={ invoice.getError("importExportType") }
					options={ [{
						label: t("invoices.importReverseCharge"),
						value: ImportExportType.ImportAccordingToTheReverseChargeMechanism
					}, {
						label: t("invoices.importCustomsPaid"),
						value: ImportExportType.ImportPaidForCustoms
					}] }
				/>
			) }

			{ invoiceOrigin.value.canBeImportInvoice && (
				<CheckboxField checked label={ t("invoices.exportInvoice") }/>
			) }

			<div className="col-span-1 md:col-span-2 lg:col-span-4">
				<TextField
					label={ t("invoices.notes") }
					value={ invoice.notes }
				/>
			</div>
		</FieldsSection>
	);
}
