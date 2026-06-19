import { useTranslation } from "react-i18next";
import { CurrenciesSearchableSelect, FieldGroup, FieldsSection, FormField, SelectField, TextAreaField } from "yusr-ui";
import type { Setting } from "@/core/data/setting.ts";
import { EInvoicingEnvironmentType, InvoicePrintSize } from "@/core/data/setting.ts";
import { EInvoicingRegisterButton } from "./eInvoicing/eInvoicingRegisterButton";
import { useSignals } from "@preact/signals-react/runtime";
import TaxesSearchableSelect from "@/core/components/searchableSelect/taxesSearchableSelect.tsx";


export default function InvoiceSection({formData}: { formData: Setting })
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	return (
		<div className="space-y-10 animate-in fade-in">
			<FieldGroup>
				<FieldsSection title={ t("settings.invoiceAndTaxSettings") } columns={ 2 }>
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

					<div className="flex flex-col gap-1.5 w-full">
						<label className="text-sm font-medium">{ t("settings.defaultTax") }</label>

						<TaxesSearchableSelect
							id={ formData.mainTaxId }
							label={ formData.mainTax?.value?.name }
						/>
					</div>

					<SelectField
						label={ t("settings.invoicePrintSize") }
						value={ formData.invoicePrintSize || InvoicePrintSize.A4 }
						onValueChange={ (val) =>
						{
							formData.invoicePrintSize.value = val;
						} }
						options={
							[
								{
									label: t("settings.a4Paper"),
									value: InvoicePrintSize.A4
								},
								{
									label: t("settings.thermalPrinter"),
									value: InvoicePrintSize.ThermalPrinter
								}
							] }
					/>
				</FieldsSection>

				<FieldsSection columns={ 1 }>
					<TextAreaField
						label={ t("settings.invoicePolicy") }
						value={ formData.invoicePolicy }
						rows={ 3 }
						placeholder={ t("settings.invoicePolicyPlaceholder") }
					/>
				</FieldsSection>
			</FieldGroup>

			<EInvoicingRegisterButton
				formData={ formData }
				title="Testing"
				subtitle="sandbox"
				linkType={ EInvoicingEnvironmentType.Test }
			/>

			<EInvoicingRegisterButton
				formData={ formData }
				title="Fatoora Simulation"
				subtitle={ t("settings.simulationSubtitle") }
				linkType={ EInvoicingEnvironmentType.Simulation }
			/>

			<EInvoicingRegisterButton
				formData={ formData }
				title="Fatoora Portal"
				subtitle={ t("settings.productionSubtitle") }
				linkType={ EInvoicingEnvironmentType.Production }
			/>
		</div>
	);
}
