import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextAreaField } from "yusr-ui";
import Invoice, { InvoiceMode } from "@/core/data/invoice.ts";
import { Services } from "@/core/services/services.ts";


export default function InvoicePolicyTab({invoice}: { invoice: Invoice })
{
	const {t} = useTranslation("accounting");

	useEffect(() =>
	{
		if (Services.auth.setting?.invoicePolicy?.value && !invoice.policy.value && invoice.mode.value !== InvoiceMode.Update)
		{
			invoice.policy.value = Services.auth.setting?.invoicePolicy?.value;
		}
	}, [invoice.mode.value, invoice.policy]);

	return (
		<TextAreaField
			label={ t("invoices.policyTerms") }
			value={ invoice.policy }
			disabled={ invoice.isDisabled }
			className="h-100"
		/>
	);
}
