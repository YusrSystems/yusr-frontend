import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ApiConstants, YusrApiHelper } from "yusr-core";
import { YusrBusBackground } from "yusr-ui";
import type Registration from "../../../core/data/registration";
import { logout, useAppDispatch, useAppSelector } from "../../../core/state/store";
import { nextStep, prevStep, registerAsync } from "../logic/registerSlice";
import { RegisterForm } from "./registerForm";
import Wellcome from "./wellcome";

export default function RegisterPage()
{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { formData, acceptPolicies, successed } = useAppSelector((state) => state.register);

  useEffect(() =>
  {
    const Logout = async () =>
    {
      const result = await YusrApiHelper.Post(`${ApiConstants.baseUrl}/Logout`);

      if (result.status === 200 || result.status === 204)
      {
        dispatch(logout());
      }
    };

    Logout();
  }, []);

  const handleSubmit = async () =>
  {
    if (!acceptPolicies)
    {
      toast.error("يجب الموافقة على شروط الخدمة وسياسة الخصوصية للمتابعة");
      return;
    }

    await dispatch(registerAsync(formData as Registration));
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <YusrBusBackground />
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
      { successed && <Wellcome /> }
    </div>
  );
}
