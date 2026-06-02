import placeholderImg from "@/assets/placeholder.svg";
import { Setting } from "@/core/data/setting";
import type { SettingOld } from "@/core/data/settingOld";
import { Services } from "@/services";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiConstants, Button, Card, CardContent, Checkbox, cn, Field, FieldDescription, FieldGroup, LoginRequest, PasswordField, TextField, User, UserOld, YusrApiHelper } from "yusr-ui";

const emailStorageItemName = "remembered_email";
const usernameStorageItemName = "remembered_username";
const formData = new LoginRequest({
  companyEmail: localStorage.getItem(emailStorageItemName) ?? "",
  username: localStorage.getItem(usernameStorageItemName) ?? "",
  password: ""
});
const rememberMe = signal(
  !!(localStorage.getItem(emailStorageItemName) || localStorage.getItem(usernameStorageItemName))
);
const isLoading = signal(false);

export function LoginForm({ className, ...props }: React.ComponentProps<"div">)
{
  useSignals();
  const { t } = useTranslation("loginRegister");
  const navigate = useNavigate();
  const location = useLocation();

  const Login = async () =>
  {
    if (!formData.validate())
    {
      return;
    }

    if (rememberMe)
    {
      localStorage.setItem(emailStorageItemName, formData.companyEmail.value || "");
      localStorage.setItem(usernameStorageItemName, formData.username.value || "");
    }
    else
    {
      localStorage.removeItem(emailStorageItemName);
      localStorage.removeItem(usernameStorageItemName);
    }

    isLoading.value = true;

    const result = await YusrApiHelper.Post<{ user: UserOld; setting: SettingOld; }>(
      `${ApiConstants.baseUrl}/Login`,
      formData.toJson()
    );

    if (result.status === 200 && result.data)
    {
      Services.auth.login(new User(result.data.user), new Setting(result.data.setting));

      const origin = location.state?.from?.pathname || "/dashboard";

      isLoading.value = false;

      setTimeout(() =>
      {
        navigate(origin, { replace: true });
      }, 10);
    }
    else
    {
      isLoading.value = false;
    }
  };

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
                <h1 className="text-2xl font-bold">{ t("login.title") }</h1>
                <p className="text-muted-foreground text-balance">{ t("login.subtitle") }</p>
              </div>

              <TextField
                label={ t("login.email.label") }
                id="companyEmail"
                type="companyEmail"
                placeholder={ t("login.email.placeholder") }
                value={ formData.companyEmail.value || "" }
                isInvalid={ formData.isInvalid("companyEmail") }
                error={ formData.getError("companyEmail").value }
                onChange={ (e) =>
                {
                  formData.companyEmail.value = e.target.value;
                  formData.clearError("companyEmail");
                } }
                required
              />

              <TextField
                label={ t("login.username.label") }
                id="username"
                type="text"
                placeholder={ t("login.username.placeholder") }
                value={ formData.username.value || "" }
                isInvalid={ formData.isInvalid("username") }
                error={ formData.getError("username").value }
                onChange={ (e) =>
                {
                  formData.username.value = e.target.value;
                  formData.clearError("username");
                } }
                required
              />

              <PasswordField
                label={ t("login.password.label") }
                id="password"
                placeholder={ t("login.password.placeholder") }
                value={ formData.password.value || "" }
                isInvalid={ formData.isInvalid("password") }
                error={ formData.getError("password").value }
                onChange={ (e) =>
                {
                  formData.password.value = e.target.value;
                  formData.clearError("password");
                } }
                required
              />

              <div className="flex items-center gap-3">
                <Checkbox
                  id="rememberMe"
                  checked={ rememberMe.value }
                  onCheckedChange={ (checked) => rememberMe.value = checked as boolean }
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  { t("login.rememberMe") }
                </label>
              </div>

              <Field>
                <Button type="button" disabled={ isLoading.value } onClick={ Login }>
                  { isLoading.value && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
                  { t("login.button") }
                </Button>
              </Field>
              <FieldDescription className="text-center">
                { t("login.noAccount") } <Link to="/register">{ t("login.registerLink") }</Link>
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
