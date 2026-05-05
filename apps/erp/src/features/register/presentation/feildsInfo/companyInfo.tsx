import { filterCurrencies } from "@/core/state/shared/currencySlice";
import { useTranslation } from "react-i18next";
import { SearchableSelect, TextField } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { updateField } from "../../logic/registerSlice";

export default function CompanyInfo()
{
  const { t } = useTranslation("loginRegister");
  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.register);
  const currencyState = useAppSelector((state) => state.currency);

  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }

  return (
    <>
      <TextField
        label={ t("register.companyInfo.companyName.label") }
        id="companyName"
        type="text"
        placeholder={ t("register.companyInfo.companyName.placeholder") }
        value={ formData.companyName || "" }
        isInvalid={ !!errors.companyName }
        error={ errors.companyName }
        onChange={ (e) => onFieldChange({ companyName: e.target.value }) }
        required
      />

      <TextField
        label={ t("register.companyInfo.email.label") }
        id="email"
        type="email"
        placeholder={ t("register.companyInfo.email.placeholder") }
        value={ formData.email || "" }
        isInvalid={ !!errors.email }
        error={ errors.email }
        onChange={ (e) => onFieldChange({ email: e.target.value }) }
        required
      />

      <TextField
        label={ t("register.companyInfo.branchName.label") }
        id="branchName"
        type="text"
        placeholder={ t("register.companyInfo.branchName.placeholder") }
        value={ formData.branchName || "" }
        isInvalid={ !!errors.branchName }
        error={ errors.branchName }
        onChange={ (e) => onFieldChange({ branchName: e.target.value }) }
        required
      />

      <TextField
        label={ t("register.companyInfo.companyBusinessCategory.label") }
        id="companyBusinessCategory"
        type="text"
        placeholder={ t("register.companyInfo.companyBusinessCategory.placeholder") }
        value={ formData.companyBusinessCategory || "" }
        isInvalid={ !!errors.companyBusinessCategory }
        error={ errors.companyBusinessCategory }
        onChange={ (e) => onFieldChange({ companyBusinessCategory: e.target.value }) }
        required
      />

      <TextField
        label={ t("register.companyInfo.companyPhone.label") }
        id="companyPhone"
        type="tel"
        placeholder={ t("register.companyInfo.companyPhone.placeholder") }
        value={ formData.companyPhone || "" }
        isInvalid={ !!errors.companyPhone }
        error={ errors.companyPhone }
        onChange={ (e) => onFieldChange({ companyPhone: e.target.value }) }
        required
      />

      <TextField
        label={ t("register.companyInfo.crn.label") }
        id="crn"
        type="text"
        placeholder={ t("register.companyInfo.crn.placeholder") }
        value={ formData.crn || "" }
        isInvalid={ !!errors.crn }
        error={ errors.crn }
        onChange={ (e) => onFieldChange({ crn: e.target.value }) }
        required
      />

      <TextField
        label={ t("register.companyInfo.vatNumber.label") }
        id="vatNumber"
        type="text"
        placeholder={ t("register.companyInfo.vatNumber.placeholder") }
        value={ formData.vatNumber || "" }
        isInvalid={ !!errors.vatNumber }
        error={ errors.vatNumber }
        onChange={ (e) => onFieldChange({ vatNumber: e.target.value }) }
        required
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium">
          { t("register.companyInfo.currency.label") } <span className="text-red-500">*</span>
        </label>

        <SearchableSelect
          items={ currencyState.entities?.data ?? [] }
          value={ formData.currencyId?.toString() ?? "" }
          isInvalid={ !!errors.currencyId }
          columnsNames={ [{ label: "اسم العملة", value: "name" }] }
          itemLabelKey="name"
          itemValueKey="id"
          disabled={ currencyState.isLoading }
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
