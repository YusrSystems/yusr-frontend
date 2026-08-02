import { useTranslation } from "react-i18next";
import { TextAreaField } from "yusr-ui";
import Invoice from "@/core/data/invoices/invoice.ts";
import { useSignals } from "@preact/signals-react/runtime";


export default function InvoicePolicyTab({invoice}: { invoice: Invoice })
{
	useSignals();
	const {t} = useTranslation("accounting");

	return (
		<TextAreaField
			label={ t("invoices.policyTerms") }
			value={ invoice.policy }
			disabled={ invoice.isDisabled }
			className="h-100"
		/>
	);
}
