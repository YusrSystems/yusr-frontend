import { useEffect } from "react";
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

  useEffect(() =>
  {
    if (authState.setting?.invoicePolicy && !formData.policy)
    {
      dispatch(slice.formActions.updateFormData({ policy: authState.setting.invoicePolicy }));
    }
  }, [authState.setting?.invoicePolicy]);

  return (
    <TextAreaField
      label={ t("invoices.policyTerms") }
      value={ formData.policy ?? "" }
      onChange={ (e) => dispatch(slice.formActions.updateFormData({ policy: e.target.value })) }
      disabled={ disabled }
      className="h-100"
    />
  );
}
