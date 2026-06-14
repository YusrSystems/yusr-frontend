import placeholderImg from "@/assets/placeholder.svg";
import { login, updateLoggedInUser } from "@/core/state/store";
import { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowRight, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, cn, Field, FieldDescription, FieldGroup, i18n, PasswordField, TextField } from "yusr-ui";
import { RegistrationCubit } from "../logic/registrationCubit";
import { RegistrationStateLoading } from "../logic/registrationState";

import { useAppDispatch } from "@/core/state/store";
import { GoogleLogin } from "@react-oauth/google";
import { UserOld } from "yusr-ui";
export interface RegisterFormProps
{
  className?: string;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  onLoginClick: () => void;
}

export function RegisterForm({
  className,
  onNextStep,
  onPrevStep,
  onSubmit,
  onLoginClick,
  ...props
}: RegisterFormProps)
{
  useSignals();
  const { t } = useTranslation("loginRegister");
  const dispatch = useAppDispatch();
  const cubit = useMemo(() => new RegistrationCubit(), []);

  const isLoading = cubit.state.value instanceof RegistrationStateLoading;
  console.log(isLoading);

  return (
    <div className={ cn("flex flex-col gap-6", className) } { ...props }>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-full flex justify-start mb-5">
                  <Link
                    to="/"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 ltr:rotate-180 rtl:rotate-0" />
                    { t("login.backToHome") }
                  </Link>
                </div>

                <h1 className="text-2xl font-bold">{ t("register.title") }</h1>
                <p className="text-muted-foreground text-balance">{ t("register.subtitle") }</p>
              </div>

              <RegisterInfo cubit={ cubit } />
              <AcceptTerms hasAcceptedPolicies={ cubit.formData.hasAcceptedPolicies } />
              <SubmitButton
                isLoading={ isLoading }
                onSubmit={ async () =>
                  await cubit.register((result) =>
                  {
                    dispatch(login(result.data));
                    dispatch(updateLoggedInUser((result.data?.user ?? {}) as UserOld));
                  }) }
              />

              <SignInWithGoogle cubit={ cubit } />

              <FieldDescription className="text-center">
                { t("register.alreadyHaveAccount") }{" "}
                <a
                  href="#"
                  onClick={ (e) =>
                  {
                    e.preventDefault();
                    onLoginClick();
                  } }
                >
                  { t("register.buttons.login") }
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={ placeholderImg }
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RegisterInfo({ cubit }: { cubit: RegistrationCubit; })
{
  useSignals();
  const isLoading = cubit.state instanceof RegistrationStateLoading;

  return (
    <>
      <TextField
        label={ i18n.t("loginRegister:register.companyInfo.companyName.label") }
        type="text"
        placeholder={ i18n.t("loginRegister:register.companyInfo.companyName.placeholder") }
        value={ cubit.formData.companyName }
        error={ cubit.formData.getError("companyName") }
        required
        disabled={ isLoading }
      />

      <TextField
        dir="ltr"
        className="text-right"
        label={ i18n.t("loginRegister:register.companyInfo.email.label") }
        type="text"
        placeholder={ i18n.t("loginRegister:register.companyInfo.email.placeholder") }
        value={ cubit.formData.email }
        error={ cubit.formData.getError("email") }
        required
        disabled={ isLoading }
      />
      <TextField
        label={ i18n.t("loginRegister:register.companyInfo.branchName.label") }
        type="text"
        placeholder={ i18n.t("loginRegister:register.companyInfo.branchName.placeholder") }
        value={ cubit.formData.branchName }
        error={ cubit.formData.getError("branchName") }
        required
        disabled={ isLoading }
      />

      <TextField
        label={ i18n.t("loginRegister:register.accountInfo.username.label") }
        type="text"
        placeholder={ i18n.t("loginRegister:register.accountInfo.username.placeholder") }
        value={ cubit.formData.username }
        error={ cubit.formData.getError("username") }
        required
        disabled={ isLoading }
      />

      <PasswordField
        label={ i18n.t("login:password.label") }
        id="password"
        placeholder={ i18n.t("login:password.placeholder") }
        value={ cubit.formData.userPassword }
        error={ cubit.formData.getError("userPassword") }
        required
        disabled={ isLoading }
      />
    </>
  );
}

function AcceptTerms({ hasAcceptedPolicies }: { hasAcceptedPolicies: Signal<boolean>; })
{
  useSignals();
  return (
    <div className="flex items-start space-x-2 rtl:space-x-reverse">
      <span className="text-red-500">*</span>
      <input
        type="checkbox"
        id="acceptPolicies"
        checked={ hasAcceptedPolicies.value }
        onChange={ () => hasAcceptedPolicies.value = !hasAcceptedPolicies.value }
        className="mt-1 me-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <label
        htmlFor="acceptPolicies"
        className={ cn(
          "text-sm text-muted-foreground",
          !hasAcceptedPolicies.value && "border border-b-2 border-t-0 border-l-0 border-r-0 border-red-600  "
        ) }
      >
        { i18n.t("loginRegister:register.accountInfo.acceptPolicies") }{" "}
        <a
          rel="noopener noreferrer"
          href="https://erp.yusrsys.com/legal"
          target="_blank"
          className="text-primary hover:underline"
        >
          { i18n.t("loginRegister:register.accountInfo.termsAndPrivacy") }
        </a>
      </label>
    </div>
  );
}

function SubmitButton({ isLoading, onSubmit }: { isLoading: boolean; onSubmit: () => Promise<void>; })
{
  useSignals();

  return (
    <div className={ "flex gap-2 justify-between" }>
      <Field className="flex-1">
        <Button
          type="button"
          disabled={ isLoading }
          onClick={ onSubmit }
        >
          { isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
          { i18n.t("loginRegister:register.buttons.create") }
        </Button>
      </Field>
    </div>
  );
}

function SignInWithGoogle({ cubit }: { cubit: RegistrationCubit; })
{
  useSignals();
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col gap-2 items-center ">
      <div className="border-t-2 border-gray-900 border-dashed w-full"></div>
      <GoogleLogin
        onSuccess={ async (response) =>
        {
          if (!response.credential)
          {
            return;
          }
          cubit.externalAuthRegister(response.credential, (result) =>
          {
            const user = result.user
              ? {
                ...result.user,
                role: result.user.role
                  ? { ...result.user.role, authorizedStores: (result.user.role as any).authorizedStores ?? [] }
                  : undefined
              }
              : {};

            dispatch(login(result));
            dispatch(updateLoggedInUser(user));
          });
        } }
        onError={ () => console.log("Login Failed") }
      />
    </div>
  );
}
