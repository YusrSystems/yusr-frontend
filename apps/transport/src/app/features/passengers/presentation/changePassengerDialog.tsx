import { filterCountries } from "@/app/core/state/shared/countrySlice";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { useEffect, useMemo } from "react";
import { type ValidationRule, Validators } from "yusr-core";
import { ChangeDialog, type CommonChangeDialogProps, useEntityForm } from "yusr-ui";
import type { Passenger } from "../data/passenger";
import ChangePassengerForm from "./changePassengerForm";

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
      <ChangePassengerForm
        formData={ formData }
        handleChange={ handleChange }
        getError={ getError }
        isInvalid={ isInvalid }
        clearError={ clearError }
      />
    </ChangeDialog>
  );
}
