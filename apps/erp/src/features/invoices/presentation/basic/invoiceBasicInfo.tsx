import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckboxField, DateField, FieldsSection, FormField, SelectField, TextField } from "yusr-ui";
import Invoice, { InvoiceMode } from "@/core/data/invoices/invoice.ts";
import { signal, useComputed } from "@preact/signals-react";
import { Services } from "@/core/services/services.ts";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { ImportExportType } from "@/core/types/importExportType.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { type PartnerDto } from "@/core/data/partner.ts";
import PartnersSearchableSelect from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";


export default function InvoiceBasicInfo({invoice}: { invoice: Invoice })
{
	useSignals();
	const {t} = useTranslation("accounting");
	const selectedPartner = useMemo(() => signal<PartnerDto | undefined>(), []);

	const invoiceOrigin = useComputed(() =>
	{
		const partnerCountryId = selectedPartner.value?.city?.countryId;
		const settingsCountryId = Services.auth.setting?.branch?.value?.city.value?.countryId.value;

		if (partnerCountryId == undefined || settingsCountryId == undefined)
		{
			return {canBeExportInvoice: false, canBeImportInvoice: false};
		}

		const isCrossBorder = partnerCountryId !== settingsCountryId;

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

	return (
		<FieldsSection columns={ {base: 1, md: 2, lg: 4} }>

			<DateField
				label={ t("invoices.invoiceDate") }
				required
				value={ invoice.date }
				error={ invoice.getError("date") }
				disabled={ invoice.type.value !== InvoiceType.Quotation }
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
						invoice.paymentVouchers.value = [];
					} }
				/>
			</FormField>

			<FormField
				label={ (invoice.type.value === InvoiceType.Sell || invoice.type.value === InvoiceType.SellReturn) ? t("vouchers.customer", "العميل") : t("vouchers.supplier", "المورد") }
				required
				error={ invoice.getError("partnerId") }
			>
				<PartnersSearchableSelect
					id={ invoice.partnerId }
					label={ invoice.partnerName }
					disabled={ invoice.isDisabled }
					onSelect={ (account) =>
					{
						selectedPartner.value = account;
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
					disabled={ invoice.invoiceMode.value === InvoiceMode.Return }
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
