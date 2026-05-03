import ClientsSearchableSelect from "@/core/components/searchableSelect/clientsSearchableSelect";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import SuppliersSearchableSelect from "@/core/components/searchableSelect/suppliersSearchableSelect";
import { useEffect } from "react";
import { Checkbox, DateField, FieldsSection, FormField, SelectField, TextField } from "yusr-ui";
import Account from "../../../../core/data/account";
import { ImportExportType, InvoiceType } from "../../../../core/data/invoice";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceBasicInfo()
{
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
    <FieldsSection title="البيانات الأساسية" columns={ { base: 1, md: 2, lg: 4 } }>
      { (formData.type === InvoiceType.Sell || formData.type === InvoiceType.Quotation) && (
        <SelectField
          label="نوع الفاتورة"
          required
          value={ formData.type?.toString() || "" }
          onValueChange={ (val) => dispatch(slice.formActions.updateFormData({ type: Number(val) as InvoiceType })) }
          isInvalid={ isInvalid("type") }
          error={ getError("type") }
          disabled={ mode === "update" || mode === "return" }
          options={ [{ label: "مبيعات", value: InvoiceType.Sell.toString() }, {
            label: "عرض سعر",
            value: InvoiceType.Quotation.toString()
          }] }
        />
      ) }

      { (mode === "update" || mode === "return") && (
        <TextField
          label="تاريخ الفاتورة"
          required
          value={ formData.date ? new Date(formData.date).toISOString().split("T")[0] : "" }
          isInvalid={ isInvalid("date") }
          error={ getError("date") }
          disabled
        />
      ) }

      { mode === "create" && (
        <DateField
          label="تاريخ الفاتورة"
          required
          value={ formData.date ? new Date(formData.date) : undefined }
          onChange={ (e) => dispatch(slice.formActions.updateFormData({ date: e })) }
          isInvalid={ isInvalid("date") }
          error={ getError("date") }
        />
      ) }

      <FormField
        label="المستودع"
        required
        isInvalid={ isInvalid("storeId") }
        error={ getError("storeId") }
      >
        <StoresSearchableSelect
          id={ formData.storeId }
          isInvalid={ isInvalid("storeId") }
          onValueChange={ (store) =>
          {
            dispatch(
              slice.formActions.updateFormData({ storeId: store?.id, storeName: store?.name, invoiceItems: [] })
            );
          } }
        />
      </FormField>

      <FormField
        label="الحساب"
        required
        isInvalid={ isInvalid("actionAccountId") }
        error={ getError("actionAccountId") }
      >
        { isPurchaseInvoice() && (
          <SuppliersSearchableSelect
            id={ formData.actionAccountId }
            isInvalid={ isInvalid("actionAccountId") }
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
            id={ formData.actionAccountId }
            isInvalid={ isInvalid("actionAccountId") }
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

      <TextField
        label="رقم الفاتورة المرتبطة"
        disabled
        value={ formData.originalInvoiceId || "" }
        onChange={ () =>
        {} }
      />

      <TextField
        label="الموظف المندوب"
        value={ formData.delegateEmp || "" }
        onChange={ (e) => dispatch(slice.formActions.updateFormData({ delegateEmp: e.target.value })) }
      />

      { canBeExportInvoice() && (
        <SelectField
          label="فاتورة استيراد"
          required
          disabled={ mode === "return" }
          value={ formData.importExportType?.toString() || "" }
          onValueChange={ (val) =>
            dispatch(slice.formActions.updateFormData({ importExportType: Number(val) as ImportExportType })) }
          isInvalid={ isInvalid("importExportType") }
          error={ getError("importExportType") }
          options={ [{ label: "استيراد وفق آلية الاحتساب العكسي", value: "2" }, {
            label: "استيراد خاضع للضريبة ومسدد للجمارك",
            value: "3"
          }] }
        />
      ) }

      { canBeImportInvoice() && (
        <div className="flex items-center gap-2 mt-6 border bg-primary/5 rounded-lg px-2">
          <Checkbox id="importInvoice" checked disabled />
          <label htmlFor="importInvoice" className="text-sm font-bold">
            فاتورة تصدير
          </label>
        </div>
      ) }

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <TextField
          label="ملاحظات"
          value={ formData.notes || "" }
          onChange={ (e) => dispatch(slice.formActions.updateFormData({ notes: e.target.value })) }
        />
      </div>
    </FieldsSection>
  );
}
