import { SelectField, TextField } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { citySelected, updateField } from "../../logic/registerSlice";

export default function AddressInfo()
{
  const dispatch = useAppDispatch();
  const { formData, errors, cities } = useAppSelector((state) => state.register);

  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }
  return (
    <>
      <SelectField
        label="المدينة"
        value={ formData.cityId?.toString() ?? "" }
        isInvalid={ !!errors.cityId }
        error={ errors.cityId }
        onValueChange={ (val) => dispatch(citySelected({ cityId: parseInt(val) })) }
        required
        options={ cities.map((c) => ({ label: c.name, value: c.id.toString() })) }
      />

      <TextField
        label="الشارع"
        type="text"
        placeholder="اسم الشارع"
        value={ formData.street || "" }
        isInvalid={ !!errors.street }
        error={ errors.street }
        onChange={ (e) => onFieldChange({ street: e.target.value }) }
      />

      <TextField
        label="الحي"
        type="text"
        placeholder="اسم الحي"
        value={ formData.district || "" }
        isInvalid={ !!errors.district }
        error={ errors.district }
        onChange={ (e) => onFieldChange({ district: e.target.value }) }
      />

      <TextField
        label="رقم المبنى"
        type="text"
        placeholder="رقم المبنى"
        value={ formData.buildingNumber || "" }
        isInvalid={ !!errors.buildingNumber }
        error={ errors.buildingNumber }
        onChange={ (e) => onFieldChange({ buildingNumber: e.target.value }) }
      />

      <TextField
        label="الرمز البريدي"
        type="text"
        placeholder="الرمز البريدي"
        value={ formData.postalCode || "" }
        isInvalid={ !!errors.postalCode }
        error={ errors.postalCode }
        onChange={ (e) => onFieldChange({ postalCode: e.target.value }) }
      />
    </>
  );
}
