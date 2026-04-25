import { FieldGroup, FieldsSection, FormField, SearchableSelect, SelectField, SelectInput, TextAreaField } from "yusr-ui";
import { EInvoicingEnvironmentType, InvoicePrintSize } from "../../core/data/setting";
import { TaxFilterColumns, TaxSlice } from "../../core/data/tax";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { EInvoicingRegisterButton } from "./eInvoicing/eInvoicingRegisterButton";
import { useSettingContext } from "./settingContext";

export default function InvoiceSection()
{
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
        <FieldsSection title="إعدادات الفواتير والضرائب" columns={ 2 }>
          <FormField
            label="العملة الافتراضية"
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
            <label className="text-sm font-medium">الضريبة الافتراضية</label>
            <SearchableSelect
              items={ taxState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.mainTaxId?.toString() || "" }
              onValueChange={ (val) => handleChange({ mainTaxId: Number(val) }) }
              columnsNames={ TaxFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(TaxSlice.entityActions.filter(condition)) }
              disabled={ taxState.isLoading }
            />
          </div>

          <SelectField
            label="حجم طباعة الفاتورة"
            value={ formData.invoicePrintSize?.toString() || InvoicePrintSize.A4.toString() }
            onValueChange={ (val) => handleChange({ invoicePrintSize: Number(val) as InvoicePrintSize }) }
            options={ [{ label: "ورق A4", value: InvoicePrintSize.A4.toString() }, {
              label: "طابعة حرارية (Thermal)",
              value: InvoicePrintSize.ThermalPrinter.toString()
            }] }
          />
        </FieldsSection>

        <FieldsSection columns={ 1 }>
          <TextAreaField
            label="سياسة الفواتير (تظهر أسفل الفاتورة)"
            value={ formData.invoicePolicy || "" }
            onChange={ (e) => handleChange({ invoicePolicy: e.target.value }) }
            rows={ 3 }
            placeholder="مثال: البضاعة المباعة لا ترد ولا تستبدل بعد 3 أيام..."
          />
        </FieldsSection>
      </FieldGroup>

      <EInvoicingRegisterButton
        title="Fatoora Simulation"
        subtitle="تجربة الربط مع الهيئة"
        linkType={ EInvoicingEnvironmentType.Simulation }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Simulation }
        onFinish={ () => handleChange({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Simulation }) }
      />

      <EInvoicingRegisterButton
        title="Fatoora Portal"
        subtitle="الربط مع الهيئة وإرسال المستندات بشكل رسمي"
        linkType={ EInvoicingEnvironmentType.Production }
        linked={ formData.eInvoicingEnvironmentType === EInvoicingEnvironmentType.Production }
        onFinish={ () => handleChange({ eInvoicingEnvironmentType: EInvoicingEnvironmentType.Production }) }
      />
    </div>
  );
}
