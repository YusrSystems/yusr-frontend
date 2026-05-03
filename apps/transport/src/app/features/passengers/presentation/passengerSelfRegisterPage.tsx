import { filterCountries } from "@/app/core/state/shared/countrySlice";
import { GetTenantInfo } from "@/app/core/state/shared/systemSlice";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { type ValidationRule, Validators } from "yusr-ui";
import { ThemeToggle, useEntityForm } from "yusr-ui";
import type { Passenger } from "../data/passenger";
import { resetRegistration, selfRegister } from "../logic/passengerSelfRegisterSlice";
import ChangePassengerForm from "./changePassengerForm";

export default function PassengerSelfRegisterPage()
{
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");
  const dispatch = useAppDispatch();

  const { tenant, isLoading: tenantLoading } = useAppSelector((s) => s.system);
  const { completed, isLoading: submitting, error } = useAppSelector((s) => s.passengerSelfRegister);

  const validationRules: ValidationRule<Partial<Passenger>>[] = useMemo(
    () => [
      {
        field: "name",
        selector: (d) => d.name,
        validators: [Validators.required("يرجى إدخال اسم الراكب")]
      },
      {
        field: "nationalityId",
        selector: (d) => d.nationalityId,
        validators: [Validators.required("يرجى اختيار الجنسية")]
      },
      { field: "gender", selector: (d) => d.gender, validators: [Validators.required("يرجى اختيار الجنس")] },
      { field: "passportNo", selector: (d) => d.passportNo, validators: [Validators.required("يرجى إدخال رقم الجواز")] }
    ],
    []
  );

  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Passenger>(
    undefined,
    validationRules
  );

  useEffect(() =>
  {
    if (!key)
    {
      return;
    }
    dispatch(resetRegistration());
    dispatch(GetTenantInfo(key));
    dispatch(filterCountries(undefined));
  }, [key, dispatch]);

  const handleSubmit = () =>
  {
    if (!validate() || !key)
    {
      return;
    }
    dispatch(selfRegister({ key, passenger: formData as Passenger }));
  };

  // ── States ────────────────────────────────────────────────────────────────

  if (!key)
  {
    return <InvalidState />;
  }
  if (tenantLoading)
  {
    return <LoadingState />;
  }
  if (!tenant)
  {
    return <InvalidState />;
  }
  if (completed)
  {
    return <SuccessState tenantName={ tenant.name } />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-6 flex items-center gap-3">
        <ThemeToggle />
        <h3 className="text-lg">تغيير السمة</h3>
      </div>
      <div className="flex-1 flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-2xl border rounded-xl p-6 space-y-6">
          { /* Tenant header */ }
          <div className="flex items-center gap-3 pb-4 border-b">
            { tenant.logo?.url
              ? <img src={ tenant.logo?.url } className="w-15 h-15 rounded-lg object-cover" alt={ tenant.name } />
              : (
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-medium text-lg">
                  { tenant.name?.[0] }
                </div>
              ) }
            <div>
              <p className="font-medium text-base">{ tenant.name }</p>
              <p className="text-sm text-muted-foreground">تسجيل بيانات الراكب</p>
            </div>
          </div>

          <ChangePassengerForm
            formData={ formData }
            handleChange={ handleChange }
            getError={ getError }
            isInvalid={ isInvalid }
            clearError={ clearError }
          />

          { error && <p className="text-sm text-destructive text-center">{ error }</p> }

          <button
            onClick={ handleSubmit }
            disabled={ submitting }
            className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
          >
            { submitting ? "جاري الحفظ..." : "تسجيل البيانات" }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-sm text-muted-foreground">جاري التحميل...</p>
  </div>
);

const InvalidState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center p-6">
    <p className="text-lg font-medium">رابط غير صالح</p>
    <p className="text-sm text-muted-foreground max-w-xs">
      هذا الرابط غير صحيح. يرجى التواصل مع الجهة المعنية للحصول على رابط جديد.
    </p>
  </div>
);

const SuccessState = ({ tenantName }: { tenantName?: string; }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center p-6">
    <p className="text-lg font-medium">تم التسجيل بنجاح ✓</p>
    <p className="text-sm text-muted-foreground">تم إضافة بياناتك بنجاح لدى { tenantName }. شكراً لك!</p>
  </div>
);
