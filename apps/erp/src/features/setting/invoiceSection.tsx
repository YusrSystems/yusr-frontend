import { useTranslation } from "react-i18next";
import { FieldGroup, FieldsSection, SelectField, TextAreaField } from "yusr-ui";
import type { Setting } from "@/core/data/setting.ts";
import { InvoicePrintSize } from "@/core/data/setting.ts";
import { useSignals } from "@preact/signals-react/runtime";


export default function InvoiceSection({formData}: { formData: Setting })
{
	useSignals();
	const {t} = useTranslation("erpCommon");

	return (
		<div className="space-y-10 animate-in fade-in">
			<FieldGroup>

				<FieldsSection columns={ 2 }>
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
						label={ t("settings.salesInvoicePolicy") }
						value={ formData.saleInvoicePolicy }
						rows={ 3 }
						placeholder={ t("settings.invoicePolicyPlaceholder") }
					/>
					<TextAreaField
						label={ t("settings.quotationInvoicePolicy") }
						value={ formData.quotationInvoicePolicy }
						rows={ 3 }
						placeholder={ t("settings.invoicePolicyPlaceholder") }
					/>
				</FieldsSection>
			</FieldGroup>
		</div>
	);
}
