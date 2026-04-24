import { useEffect } from "react";
import { SearchableSelect, TextField } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { updateField } from "../../logic/registerSlice";

// Adjust this import path based on where your city slice is located
import { filterCities } from "@/core/state/shared/citySlice";

export default function AddressInfo()
{
  const dispatch = useAppDispatch();

  // 1. Get formData and errors from register slice
  const { formData, errors } = useAppSelector((state) => state.register);

  // 2. Get cities from the shared city slice
  const cityState = useAppSelector((state) => state.city);

  // 3. Fetch initial cities when component mounts
  useEffect(() =>
  {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }

  return (
    <>
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium">
          المدينة <span className="text-red-500">*</span>
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
          onValueChange={ (val) => onFieldChange({ cityId: val ? parseInt(val) : undefined }) }
        />
        { !!errors.cityId && (
          <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
            { errors.cityId }
          </span>
        ) }
      </div>

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
