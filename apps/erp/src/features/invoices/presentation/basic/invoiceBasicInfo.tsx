import ClientsSearchableSelect from "@/core/components/searchableSelect/clientsSearchableSelect";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import SuppliersSearchableSelect from "@/core/components/searchableSelect/suppliersSearchableSelect";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, DateField, FieldsSection, FormField, SelectField, TextFieldOld } from "yusr-ui";
import Account from "../../../../core/data/account";
import { ImportExportType, InvoiceType } from "../../../../core/data/invoice";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceBasicInfo()
{
  const { t } = useTranslation("accounting");
  const {
    mode,
    formData,
    isInvalid,
    getError,
    slice,
    authState,
    dispatch,
    accountState
  } = useInvoiceContext();
  let selectedAccount: Account | undefined = accountState.entities?.data?.find((account) =>
    account.id === formData.actionAccountId
  );

  const canBeExportInvoice = () =>
  {
    const accountCountryId: number | undefined = selectedAccount?.city?.countryId;
    const settingsCountryId: number | undefined = authState.setting?.branch?.city?.countryId;

    if (accountCountryId == undefined || settingsCountryId == undefined)
    {
      return false;
    }
    else
    {
      return ((formData.type === InvoiceType.Purchase || formData.type === InvoiceType.PurchaseReturn)
        && accountCountryId !== settingsCountryId);
    }
  };

  const canBeImportInvoice = () =>
  {
    const accountCountryId: number | undefined = selectedAccount?.city?.countryId;
    const settingsCountryId: number | undefined = authState.setting?.branch?.city?.countryId;

    if (accountCountryId == undefined || settingsCountryId == undefined)
    {
      return false;
    }
    else
    {
      return ((formData.type === InvoiceType.Sell || formData.type === InvoiceType.SellReturn
        || formData.type === InvoiceType.Quotation)
        && accountCountryId !== settingsCountryId);
    }
  };

  useEffect(() =>
  {
    if (canBeExportInvoice())
    {
      dispatch(
        slice.formActions.updateFormData({
          importExportType: ImportExportType.ImportAccordingToTheReverseChargeMechanism
        })
      );
    }
    else
    {
      dispatch(slice.formActions.updateFormData({ importExportType: undefined }));
    }
  }, [canBeExportInvoice()]);

  const isPurchaseInvoice = () =>
    formData.type === InvoiceType.Purchase || formData.type === InvoiceType.PurchaseReturn;

  return (
    <FieldsSection columns={ { base: 1, md: 2, lg: 4 } }>
      { (mode === "update" || mode === "return") && (
        <TextFieldOld
          label={ t("invoices.invoiceDate") }
          required
          value={ formData.date ? new Date(formData.date).toISOString().split("T")[0] : "" }
          isInvalid={ isInvalid("date") }
          error={ getError("date") }
          disabled
        />
      ) }

      { mode === "create" && (
        <DateField
          label={ t("invoices.invoiceDate") }
          required
          value={ formData.date ? new Date(formData.date) : undefined }
          onChange={ (e) => dispatch(slice.formActions.updateFormData({ date: e })) }
          isInvalid={ isInvalid("date") }
          error={ getError("date") }
        />
      ) }

      <FormField
        label={ t("invoices.store") }
        required
        isInvalid={ isInvalid("storeId") }
        error={ getError("storeId") }
      >
        <StoresSearchableSelect
          selectedId={ formData.storeId }
          selectedLabel={ formData.storeName }
          isInvalid={ isInvalid("storeId") }
          disabled={ mode !== "create" && formData.type !== InvoiceType.Quotation }
          onValueChange={ (store) =>
          {
            dispatch(
              slice.formActions.updateFormData({ storeId: store?.id, storeName: store?.name, invoiceItems: [] })
            );
          } }
        />
      </FormField>

      <FormField
        label={ t("invoices.account") }
        required
        isInvalid={ isInvalid("actionAccountId") }
        error={ getError("actionAccountId") }
      >
        { isPurchaseInvoice() && (
          <SuppliersSearchableSelect
            selectedId={ formData.actionAccountId }
            selectedLabel={ formData.actionAccountName }
            isInvalid={ isInvalid("actionAccountId") }
            disabled={ mode !== "create" && formData.type !== InvoiceType.Quotation }
            onValueChange={ (account) =>
            {
              selectedAccount = account;
              dispatch(
                slice.formActions.updateFormData({ actionAccountId: account?.id, actionAccountName: account?.name })
              );
            } }
          />
        ) }

        { !isPurchaseInvoice() && (
          <ClientsSearchableSelect
            selectedId={ formData.actionAccountId }
            selectedLabel={ formData.actionAccountName }
            isInvalid={ isInvalid("actionAccountId") }
            disabled={ mode !== "create" && formData.type !== InvoiceType.Quotation }
            onValueChange={ (account) =>
            {
              selectedAccount = account;
              dispatch(
                slice.formActions.updateFormData({ actionAccountId: account?.id, actionAccountName: account?.name })
              );
            } }
          />
        ) }
      </FormField>

      <TextFieldOld
        label={ t("invoices.relatedInvoiceNumber") }
        disabled
        value={ formData.originalInvoiceId || "" }
        onChange={ () =>
        {} }
      />

      {
        /* <TextField
        label={ t("invoices.delegateEmployee") }
        value={ formData.delegateEmp || "" }
        onChange={ (e) => dispatch(slice.formActions.updateFormData({ delegateEmp: e.target.value })) }
      /> */
      }

      { canBeExportInvoice() && (
        <SelectField
          label={ t("invoices.importInvoice") }
          required
          disabled={ mode === "return" }
          value={ formData.importExportType?.toString() || "" }
          onValueChange={ (val) =>
            dispatch(slice.formActions.updateFormData({ importExportType: Number(val) as ImportExportType })) }
          isInvalid={ isInvalid("importExportType") }
          error={ getError("importExportType") }
          options={ [{ label: t("invoices.importReverseCharge"), value: "2" }, {
            label: t("invoices.importCustomsPaid"),
            value: "3"
          }] }
        />
      ) }

      { canBeImportInvoice() && (
        <div className="flex items-center gap-2 mt-6 border bg-primary/5 rounded-lg px-2">
          <Checkbox id="importInvoice" checked disabled />
          <label htmlFor="importInvoice" className="text-sm font-bold">
            { t("invoices.exportInvoice") }
          </label>
        </div>
      ) }

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <TextFieldOld
          label={ t("invoices.notes") }
          value={ formData.notes || "" }
          onChange={ (e) => dispatch(slice.formActions.updateFormData({ notes: e.target.value })) }
        />
      </div>
    </FieldsSection>
  );
}
