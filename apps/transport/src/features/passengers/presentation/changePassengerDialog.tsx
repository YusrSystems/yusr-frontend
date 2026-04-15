import { CountryFilterColumns } from "@/app/core/data/country";
import { type ValidationRule, Validators } from "@yusr_systems/core";
import { filterCountries } from "@/app/core/state/shared/countrySlice";
import { ChangeDialog, FieldGroup, type CommonChangeDialogProps, DateField, FieldsSection, FormField, PhoneField, SearchableSelect, SelectField, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import type { Gender, Passenger } from "../data/passenger";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";

export default function ChangePassengerDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Passenger>)
{
  const countryState = useAppSelector((state) => state.country);
  const dispatch = useAppDispatch();
  const validationRules: ValidationRule<Partial<Passenger>>[] = useMemo(
    () => [
      {
        field: "name",
        selector: (d) => d.name,
        validators: [Validators.required("يرجى ادخال اسم الراكب")]
      },
      {
        field: "nationalityId",
        selector: (d) => d.nationalityId,
        validators: [Validators.required("يرجى اختيار الجنسية")]
      },
      { field: "gender", selector: (d) => d.gender, validators: [Validators.required("يرجى ادخال الجنس")] },
      {
        field: "passportNo",
        selector: (d) => d.passportNo,
        validators: [Validators.required("يرجى ادخال بيانات جواز السفر")]
      }
    ],
    []
  );
  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Passenger>(
    entity,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(filterCountries(undefined));
  }, [dispatch]);

  return (
    <ChangeDialog<Passenger>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} راكب` }
      className="sm:max-w-xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => countryState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
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
              errorInputClass={ isInvalid("nationalityId") ? "border-red-500 ring-red-500" : "" }
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
    </ChangeDialog>
  );
}
