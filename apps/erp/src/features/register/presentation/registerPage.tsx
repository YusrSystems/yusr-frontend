import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ApiConstants, CitySlice, CurrencySlice, ResultStatus, useValidate, YusrApiHelper, YusrBackground } from "yusr-ui";
import type Registration from "../../../core/data/registration";
import { logout, useAppDispatch, useAppSelector } from "../../../core/state/store";
import { nextStep, prevStep, registerAsync, reset, setErrors, setStep, validationRules } from "../logic/registerSlice";
import { RegisterForm } from "./registerForm";
import Welcome from "./wellcome";

export default function RegisterPage()
{
  const { t } = useTranslation("loginRegister");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { formData, acceptPolicies, successed } = useAppSelector((state) => state.register);

  const handleSetErrors = useCallback((errors: Record<string, string>) =>
  {
    dispatch(setErrors(errors as Partial<Record<keyof Registration, string>>));
  }, [dispatch]);

  const { validate } = useValidate(formData, validationRules, handleSetErrors);

  useEffect(() =>
  {
    const Logout = async () =>
    {
      const result = await YusrApiHelper.Post(`${ApiConstants.baseUrl}/Logout`);

      if (result.status === ResultStatus.Ok || result.status === ResultStatus.NoContent)
      {
        dispatch(logout());
        dispatch(reset());
      }
    };

    Logout();
  }, [dispatch]);

  const handleSubmit = async () =>
  {
    if (!acceptPolicies)
    {
      toast.error(t("register.accountInfo.acceptPoliciesError"));
      return;
    }

    const isValid = validate();

    if (!isValid)
    {
      toast.error("خطأ في المدخلات، يرجى مراجعة الحقول المطلوبة");
      dispatch(setStep(0));
      return;
    }

    await dispatch(registerAsync(formData as Registration));
  };

  useEffect(() =>
  {
    dispatch(CurrencySlice.entityActions.filter());
    dispatch(CitySlice.entityActions.filter());
  }, [dispatch]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <YusrBackground />
      { !successed && (
        <div className="w-full max-w-sm md:max-w-4xl">
          <RegisterForm
            onNextStep={ () => dispatch(nextStep()) }
            onPrevStep={ () => dispatch(prevStep()) }
            onSubmit={ handleSubmit }
            onLoginClick={ () => navigate("/login") }
          />
        </div>
      ) }
      { successed && <Welcome /> }
    </div>
  );
}
