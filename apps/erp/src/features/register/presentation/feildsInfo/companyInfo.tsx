import { filterCurrencies } from "@/core/state/shared/currencySlice";
import { useEffect } from "react";
import { SearchableSelect, TextField } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { updateField } from "../../logic/registerSlice";

export default function CompanyInfo()
{
  const dispatch = useAppDispatch();

  // 1. Get formData and errors from register slice
  const { formData, errors } = useAppSelector((state) => state.register);

  // 2. Get currencies from the shared currency slice (where filterCurrencies actually updates)
  const currencyState = useAppSelector((state) => state.currency);

  // 3. (Optional but recommended) Fetch initial currencies when component mounts
  useEffect(() =>
  {
    dispatch(filterCurrencies(undefined));
  }, [dispatch]);

  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }

  return (
    <>
      <TextField
        label="اسم الشركة"
        id="companyName"
        type="text"
        placeholder="أدخل اسم الشركة"
        value={ formData.companyName || "" }
        isInvalid={ !!errors.companyName }
        error={ errors.companyName }
        onChange={ (e) => onFieldChange({ companyName: e.target.value }) }
        required
      />

      <TextField
        label="البريد الإلكتروني للشركة"
        id="email"
        type="email"
        placeholder="company@example.com"
        value={ formData.email || "" }
        isInvalid={ !!errors.email }
        error={ errors.email }
        onChange={ (e) => onFieldChange({ email: e.target.value }) }
        required
      />

      <TextField
        label="اسم الفرع"
        id="branchName"
        type="text"
        placeholder="أدخل اسم الفرع"
        value={ formData.branchName || "" }
        isInvalid={ !!errors.branchName }
        error={ errors.branchName }
        onChange={ (e) => onFieldChange({ branchName: e.target.value }) }
        required
      />

      <TextField
        label="نشاط الشركة التجاري"
        id="companyBusinessCategory"
        type="text"
        placeholder="مثال: تجزئة، مطاعم، تقنية..."
        value={ formData.companyBusinessCategory || "" }
        isInvalid={ !!errors.companyBusinessCategory }
        error={ errors.companyBusinessCategory }
        onChange={ (e) => onFieldChange({ companyBusinessCategory: e.target.value }) }
        required
      />

      <TextField
        label="رقم هاتف الشركة"
        id="companyPhone"
        type="tel"
        placeholder="05xxxxxxxx"
        value={ formData.companyPhone || "" }
        isInvalid={ !!errors.companyPhone }
        error={ errors.companyPhone }
        onChange={ (e) => onFieldChange({ companyPhone: e.target.value }) }
        required
      />

      <TextField
        label="السجل التجاري (CRN)"
        id="crn"
        type="text"
        placeholder="أدخل رقم السجل التجاري"
        value={ formData.crn || "" }
        isInvalid={ !!errors.crn }
        error={ errors.crn }
        onChange={ (e) => onFieldChange({ crn: e.target.value }) }
        required
      />

      <TextField
        label="الرقم الضريبي (VAT)"
        id="vatNumber"
        type="text"
        placeholder="أدخل الرقم الضريبي"
        value={ formData.vatNumber || "" }
        isInvalid={ !!errors.vatNumber }
        error={ errors.vatNumber }
        onChange={ (e) => onFieldChange({ vatNumber: e.target.value }) }
        required
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium">
          العملة <span className="text-red-500">*</span>
        </label>

        <SearchableSelect
          // 4. Use the data from the shared currency state
          items={ currencyState.entities?.data ?? [] }
          value={ formData.currencyId?.toString() ?? "" }
          isInvalid={ !!errors.currencyId }
          columnsNames={ [{ label: "اسم العملة", value: "name" }] }
          itemLabelKey="name"
          itemValueKey="id"
          disabled={ currencyState.isLoading } // Disable while searching/loading
          onSearch={ (condition) => dispatch(filterCurrencies(condition)) }
          isLoading={ currencyState.isLoading }
          onValueChange={ (val) => onFieldChange({ currencyId: Number(val) }) }
        />
        { !!errors.currencyId && (
          <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
            { errors.currencyId }
          </span>
        ) }
      </div>
    </>
  );
}
