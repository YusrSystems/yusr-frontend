import placeholderImg from "@/assets/placeholder.svg";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, cn, Field, FieldDescription, FieldGroup, i18n, PasswordField, TextField } from "yusr-ui";
import LoginCubit from "./logic/loginCubit";
import { LoginErrorState, LoginLoadingState } from "./logic/loginState";
import LoginFormSkeleton from "./loginFormSkeleton";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">)
{
  useSignals();
  const location = useLocation();
  const cubit = useMemo(() =>
  {
    let origin = location.state?.from?.pathname || "/dashboard";
    if (!origin.startsWith("/") || origin.startsWith("//"))
    {
      origin = "/dashboard";
    }

    return new LoginCubit(origin);
  }, []);

  if (cubit.state.value instanceof LoginLoadingState)
  {
    return <LoginFormSkeleton />;
  }
  else if (cubit.state.value instanceof LoginErrorState)
  {
    // show error message
  }
  const formData = cubit.formData;

  return (
    <div className={ cn("flex flex-col gap-6", className) } { ...props }>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <BackToHomeLink />

              <TextField
                label={ i18n.t("login:email.label") }
                id="companyEmail"
                type="companyEmail"
                placeholder={ i18n.t("login:email.placeholder") }
                value={ formData.companyEmail || "" }
                error={ formData.getError("companyEmail") }
                onChange={ () =>
                {
                  formData.clearError("companyEmail");
                } }
                required
              />

              <TextField
                label={ i18n.t("login:username.label") }
                id="username"
                type="text"
                placeholder={ i18n.t("login:username.placeholder") }
                value={ formData.username || "" }
                error={ formData.getError("username") }
                onChange={ () =>
                {
                  formData.clearError("username");
                } }
                required
              />

              <PasswordField
                label={ i18n.t("login:password.label") }
                id="password"
                placeholder={ i18n.t("login:password.placeholder") }
                value={ formData.password }
                error={ formData.getError("password") }
                onChange={ () =>
                {
                  formData.clearError("password");
                } }
                required
              />

              <div className="flex items-center gap-3">
                <Checkbox
                  id="rememberMe"
                  checked={ cubit.rememberMe.value }
                  onCheckedChange={ (checked) => cubit.rememberMe.value = checked as boolean }
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  { i18n.t("login:rememberMe") }
                </label>
              </div>

              <Field>
                <Button type="button" onClick={ async () => await cubit.login() }>
                  { i18n.t("login:button") }
                </Button>
              </Field>
              <FieldDescription className="text-center">
                { i18n.t("login:noAccount") } <Link to="/register">{ i18n.t("login:registerLink") }</Link>
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
function BackToHomeLink()
{
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="w-full flex justify-start mb-5">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="h-4 w-4 ltr:rotate-180 rtl:rotate-0" />
          { i18n.t("login:backToHome") }
        </Link>
      </div>
      <h1 className="text-2xl font-bold">{ i18n.t("login:title") }</h1>
      <p className="text-muted-foreground text-balance">{ i18n.t("login:subtitle") }</p>
    </div>
  );
}
