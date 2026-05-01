import { filterCountries } from "@/app/core/state/shared/countrySlice";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { CountryFilterColumns } from "yusr-core";
import { DateField, FieldGroup, FieldsSection, FormField, PhoneField, SearchableSelect, SelectField, TextField } from "yusr-ui";
import type { Gender, Passenger } from "../data/passenger";

export type ChangePassengerFormProps = {
  formData: Partial<Passenger>;
  handleChange: (update: Partial<Passenger> | ((prev: Partial<Passenger>) => Partial<Passenger>)) => void;
  getError: (field: string) => string;
  isInvalid: (field: string) => boolean;
  clearError: (field: string) => void;
};

export default function ChangePassengerForm(
  { formData, handleChange, getError, isInvalid, clearError }: ChangePassengerFormProps
)
{
  const countryState = useAppSelector((state) => state.country);
  const dispatch = useAppDispatch();
  return (
    <FieldGroup>
      <FieldsSection title="المعلومات الشخصية" columns={ 2 }>
        <TextField
          label="اسم الراكب"
          required
          value={ formData.name || "" }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
          onChange={ (e) =>
          {
            handleChange({ name: e.target.value });
            clearError("name");
          } }
        />

        <SelectField
          label="الجنس"
          required
          value={ formData.gender?.toString() || "" }
          isInvalid={ isInvalid("gender") }
          error={ getError("gender") }
          onValueChange={ (val) =>
          {
            handleChange({ gender: Number(val) as Gender });
            clearError("gender");
          } }
          options={ [{ label: "ذكر", value: "0" }, { label: "أنثى", value: "1" }] }
        />

        <FormField
          label="الجنسية"
          required
          isInvalid={ isInvalid("nationalityId") }
          error={ getError("nationalityId") }
        >
          <SearchableSelect
            items={ countryState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر الجنسية"
            value={ formData.nationalityId?.toString() || "" }
            onValueChange={ (val) =>
            {
              const selectedCountry = countryState.entities.data?.find((c) => c.id.toString() === val);
              if (selectedCountry)
              {
                handleChange({ nationalityId: selectedCountry.id, nationality: selectedCountry });
                clearError("nationalityId");
              }
            } }
            columnsNames={ CountryFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(filterCountries(condition)) }
            isLoading={ countryState.isLoading }
            isInvalid={ isInvalid("nationalityId") }
            disabled={ countryState.isLoading }
          />
        </FormField>

        <DateField
          label="تاريخ الميلاد"
          value={ formData.dateOfBirth }
          onChange={ (date) => handleChange({ dateOfBirth: date }) }
        />
      </FieldsSection>

      <FieldsSection title="معلومات التواصل" columns={ 2 }>
        <PhoneField
          label="رقم الجوال"
          value={ formData.phoneNumber || "" }
          onChange={ (e) => handleChange({ phoneNumber: e.target.value }) }
        />
        <TextField
          label="البريد الإلكتروني"
          type="email"
          value={ formData.email || "" }
          onChange={ (e) => handleChange({ email: e.target.value }) }
        />
      </FieldsSection>

      <FieldsSection title="بيانات جواز السفر" columns={ 2 }>
        <TextField
          label="رقم الجواز"
          required
          value={ formData.passportNo || "" }
          isInvalid={ isInvalid("passportNo") }
          error={ getError("passportNo") }
          onChange={ (e) =>
          {
            handleChange({ passportNo: e.target.value });
            clearError("passportNo");
          } }
        />
        <DateField
          label="تاريخ انتهاء الجواز"
          value={ formData.passportExpiration }
          onChange={ (date) => handleChange({ passportExpiration: date }) }
        />
        <TextField
          label="مكان إصدار الجواز"
          className="md:col-span-2"
          value={ formData.passportIssueLocation || "" }
          onChange={ (e) => handleChange({ passportIssueLocation: e.target.value }) }
        />
      </FieldsSection>
    </FieldGroup>
  );
}
