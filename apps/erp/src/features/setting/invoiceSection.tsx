import { useTranslation } from "react-i18next";
import { FieldGroup, FieldsSection, FormField, SearchableSelect, SelectField, SelectInput, TextAreaField } from "yusr-ui";
import { EInvoicingEnvironmentType, InvoicePrintSize } from "../../core/data/setting";
import { TaxFilterColumns, TaxSlice } from "../../core/data/tax";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { EInvoicingRegisterButton } from "./eInvoicing/eInvoicingRegisterButton";
import { useSettingContext } from "./settingContext";

export default function InvoiceSection()
{
  const { t } = useTranslation("erpCommon");

  const {
    formData,
    handleChange,
    isInvalid,
    getError,
    clearError
  } = useSettingContext();

  const dispatch = useAppDispatch();
  const currencyState = useAppSelector((state) => state.currency);
  const taxState = useAppSelector((state) => state.tax);

  return (
    <div className="space-y-10 animate-in fade-in">
      <FieldGroup>
        <FieldsSection title={ t("settings.invoiceAndTaxSettings") } columns={ 2 }>
          <FormField
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
              onValueChange={ (val) =>
              {
                handleChange({ currencyId: Number(val) });
                clearError("currencyId");
              } }
            />
          </FormField>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">{ t("settings.defaultTax") }</label>
            <SearchableSelect
              items={ taxState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.mainTaxId?.toString() || "" }
              onValueChange={ (val) => handleChange({ mainTaxId: Number(val) }) }
              columnsNames={ TaxFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(TaxSlice.entityActions.filter(condition)) }
              isLoading={ taxState.isLoading }
              disabled={ taxState.isLoading }
            />
          </div>

          <SelectField
            label={ t("settings.invoicePrintSize") }
            value={ formData.invoicePrintSize?.toString() || InvoicePrintSize.A4.toString() }
            onValueChange={ (val) => handleChange({ invoicePrintSize: Number(val) as InvoicePrintSize }) }
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
            onChange={ (e) => handleChange({ invoicePolicy: e.target.value }) }
            rows={ 3 }
            placeholder={ t("settings.invoicePolicyPlaceholder") }
          />
        </FieldsSection>
      </FieldGroup>

      <EInvoicingRegisterButton
        title="test"
        subtitle="test"
        linkType={ EInvoicingEnvironmentType.Test }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Test }
        onFinish={ () => handleChange({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Test }) }
      />

      <EInvoicingRegisterButton
        title="Fatoora Simulation"
        subtitle={ t("settings.simulationSubtitle") }
        linkType={ EInvoicingEnvironmentType.Simulation }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Simulation }
        onFinish={ () => handleChange({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Simulation }) }
      />

      <EInvoicingRegisterButton
        title="Fatoora Portal"
        subtitle={ t("settings.productionSubtitle") }
        linkType={ EInvoicingEnvironmentType.Production }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Production }
        onFinish={ () => handleChange({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Production }) }
      />
    </div>
  );
}
