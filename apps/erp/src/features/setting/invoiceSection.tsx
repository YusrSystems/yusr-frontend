import { useTranslation } from "react-i18next";
import { FieldGroup, FieldsSection, FormFieldOld, SelectField, SelectInput, TextAreaField, useAppDispatch, useFormErrors } from "yusr-ui";
import TaxesSearchableSelect from "../../core/components/searchableSelect/taxesSearchableSelect";
import { EInvoicingEnvironmentType, InvoicePrintSize, SettingSlice } from "../../core/data/settingOld";
import { useAppSelector } from "../../core/state/store";
import { EInvoicingRegisterButton } from "./eInvoicing/eInvoicingRegisterButton";

export default function InvoiceSection()
{
  const { t } = useTranslation("erpCommon");
  const { formData, errors } = useAppSelector((state) => state.settingForm);
  const { getError, isInvalid } = useFormErrors(errors);

  const currencyState = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-10 animate-in fade-in">
      <FieldGroup>
        <FieldsSection title={ t("settings.invoiceAndTaxSettings") } columns={ 2 }>
          <FormFieldOld
            label={ t("settings.defaultCurrency") }
            required
            isInvalid={ isInvalid("currencyId") }
            error={ getError("currencyId") }
          >
            <SelectInput
              value={ formData.currencyId?.toString() || "" }
              disabled={ currencyState.isLoading }
              isInvalid={ isInvalid("currencyId") }
              options={ currencyState.entities.data?.map((c) => ({ label: c.name, value: c.id.toString() }))
                || [] }
              onValueChange={ (val) => dispatch(SettingSlice.formActions.updateFormData({ currencyId: Number(val) })) }
            />
          </FormFieldOld>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{ t("settings.defaultTax") }</label>
            <TaxesSearchableSelect
              showNullOption
              selectedId={ formData.mainTaxId }
              selectedLabel={ formData.mainTax?.name }
              onValueChange={ (tax) =>
                dispatch(SettingSlice.formActions.updateFormData({ mainTaxId: tax?.id, mainTax: tax })) }
            />
          </div>

          <SelectField
            label={ t("settings.invoicePrintSize") }
            value={ formData.invoicePrintSize?.toString() || InvoicePrintSize.A4.toString() }
            onValueChange={ (val) =>
              dispatch(SettingSlice.formActions.updateFormData({ invoicePrintSize: Number(val) as InvoicePrintSize })) }
            options={ [{ label: t("settings.a4Paper"), value: InvoicePrintSize.A4.toString() }, {
              label: t("settings.thermalPrinter"),
              value: InvoicePrintSize.ThermalPrinter.toString()
            }] }
          />
        </FieldsSection>

        <FieldsSection columns={ 1 }>
          <TextAreaField
            label={ t("settings.invoicePolicy") }
            value={ formData.invoicePolicy || "" }
            onChange={ (e) => dispatch(SettingSlice.formActions.updateFormData({ invoicePolicy: e.target.value })) }
            rows={ 3 }
            placeholder={ t("settings.invoicePolicyPlaceholder") }
          />
        </FieldsSection>
      </FieldGroup>

      <EInvoicingRegisterButton
        title="Testing"
        subtitle="sandbox"
        linkType={ EInvoicingEnvironmentType.Test }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Test }
        onFinish={ () =>
          dispatch(
            SettingSlice.formActions.updateFormData({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Test })
          ) }
      />

      <EInvoicingRegisterButton
        title="Fatoora Simulation"
        subtitle={ t("settings.simulationSubtitle") }
        linkType={ EInvoicingEnvironmentType.Simulation }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Simulation }
        onFinish={ () =>
          dispatch(
            SettingSlice.formActions.updateFormData({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Simulation })
          ) }
      />

      <EInvoicingRegisterButton
        title="Fatoora Portal"
        subtitle={ t("settings.productionSubtitle") }
        linkType={ EInvoicingEnvironmentType.Production }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Production }
        onFinish={ () =>
          dispatch(
            SettingSlice.formActions.updateFormData({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Production })
          ) }
      />
    </div>
  );
}
