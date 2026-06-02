import { useTranslation } from "react-i18next";
import { CitiesSearchableSelect, TextFieldOld } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { updateField } from "../../logic/registerSlice";

export default function AddressInfo()
{
  const { t } = useTranslation("loginRegister");
  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.register);

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

        <CitiesSearchableSelect
          selectedId={ formData.cityId }
          selectedLabel={ formData.cityId?.toString() }
          isInvalid={ !!errors.cityId }
          onValueChange={ (city) => onFieldChange({ cityId: city?.id }) }
        />
        { !!errors.cityId && (
          <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
            { errors.cityId }
          </span>
        ) }
      </div>

      <TextFieldOld
        label={ t("register.addressInfo.street.label") }
        type="text"
        placeholder={ t("register.addressInfo.street.placeholder") }
        value={ formData.street || "" }
        isInvalid={ !!errors.street }
        error={ errors.street }
        onChange={ (e) => onFieldChange({ street: e.target.value }) }
      />

      <TextFieldOld
        label={ t("register.addressInfo.district.label") }
        type="text"
        placeholder={ t("register.addressInfo.district.placeholder") }
        value={ formData.district || "" }
        isInvalid={ !!errors.district }
        error={ errors.district }
        onChange={ (e) => onFieldChange({ district: e.target.value }) }
      />

      <TextFieldOld
        label={ t("register.addressInfo.buildingNumber.label") }
        type="text"
        placeholder={ t("register.addressInfo.buildingNumber.placeholder") }
        value={ formData.buildingNumber || "" }
        isInvalid={ !!errors.buildingNumber }
        error={ errors.buildingNumber }
        onChange={ (e) => onFieldChange({ buildingNumber: e.target.value }) }
      />

      <TextFieldOld
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
