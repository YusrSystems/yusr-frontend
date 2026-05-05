import { filterCities } from "@/core/state/shared/citySlice";
import { useTranslation } from "react-i18next";
import { SearchableSelect, TextField } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { updateField } from "../../logic/registerSlice";

export default function AddressInfo()
{
  const { t } = useTranslation("loginRegister");
  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.register);
  const cityState = useAppSelector((state) => state.city);

  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }

  return (
    <>
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium">
          { t("register.addressInfo.city.label") } <span className="text-red-500">*</span>
        </label>

        <SearchableSelect
          items={ cityState.entities?.data ?? [] }
          value={ formData.cityId?.toString() ?? "" }
          isInvalid={ !!errors.cityId }
          columnsNames={ [{ label: "اسم المدينة", value: "name" }] }
          itemLabelKey="name"
          itemValueKey="id"
          disabled={ cityState.isLoading }
          onSearch={ (condition) => dispatch(filterCities(condition)) }
          isLoading={ cityState.isLoading }
          onValueChange={ (val) => onFieldChange({ cityId: val ? parseInt(val) : undefined }) }
        />
        { !!errors.cityId && (
          <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
            { errors.cityId }
          </span>
        ) }
      </div>

      <TextField
        label={ t("register.addressInfo.street.label") }
        type="text"
        placeholder={ t("register.addressInfo.street.placeholder") }
        value={ formData.street || "" }
        isInvalid={ !!errors.street }
        error={ errors.street }
        onChange={ (e) => onFieldChange({ street: e.target.value }) }
      />

      <TextField
        label={ t("register.addressInfo.district.label") }
        type="text"
        placeholder={ t("register.addressInfo.district.placeholder") }
        value={ formData.district || "" }
        isInvalid={ !!errors.district }
        error={ errors.district }
        onChange={ (e) => onFieldChange({ district: e.target.value }) }
      />

      <TextField
        label={ t("register.addressInfo.buildingNumber.label") }
        type="text"
        placeholder={ t("register.addressInfo.buildingNumber.placeholder") }
        value={ formData.buildingNumber || "" }
        isInvalid={ !!errors.buildingNumber }
        error={ errors.buildingNumber }
        onChange={ (e) => onFieldChange({ buildingNumber: e.target.value }) }
      />

      <TextField
        label={ t("register.addressInfo.postalCode.label") }
        type="text"
        placeholder={ t("register.addressInfo.postalCode.placeholder") }
        value={ formData.postalCode || "" }
        isInvalid={ !!errors.postalCode }
        error={ errors.postalCode }
        onChange={ (e) => onFieldChange({ postalCode: e.target.value }) }
      />
    </>
  );
}
