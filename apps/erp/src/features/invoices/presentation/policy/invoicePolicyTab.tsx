import { useTranslation } from "react-i18next";
import { TextAreaField } from "yusr-ui";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoicePolicyTab()
{
  const { t } = useTranslation("accounting");
  const {
    formData,
    slice,
    dispatch,
    authState,
    disabled
  } = useInvoiceContext();

  return (
    <TextAreaField
      label={ t("invoices.policyTerms") }
      value={ formData.policy || authState.setting?.invoicePolicy || "" }
      onChange={ (e) => dispatch(slice.formActions.updateFormData({ policy: e.target.value })) }
      disabled={ disabled }
      className="h-100"
    />
  );
}
