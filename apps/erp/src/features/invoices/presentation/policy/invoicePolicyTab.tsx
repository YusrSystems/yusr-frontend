import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {TextAreaFieldOld} from "yusr-ui";
import type {InvoiceDialogMode} from "../../changeInvoiceDialog.tsx";
import {useInvoiceContext} from "../../logic/invoiceContext";

export default function InvoicePolicyTab({mode}: { mode: InvoiceDialogMode; }) {
    const {t} = useTranslation("accounting");
    const {
        formData,
        slice,
        dispatch,
        authState,
        disabled
    } = useInvoiceContext();

    useEffect(() => {
        if (authState.setting?.invoicePolicy && !formData.policy && mode !== "update") {
            dispatch(slice.formActions.updateFormData({policy: authState.setting.invoicePolicy}));
        }
    }, [authState.setting?.invoicePolicy]);

    return (
        <TextAreaFieldOld
            label={t("invoices.policyTerms")}
            value={formData.policy ?? ""}
            onChange={(e) => dispatch(slice.formActions.updateFormData({policy: e.target.value}))}
            disabled={disabled}
            className="h-100"
        />
    );
}
