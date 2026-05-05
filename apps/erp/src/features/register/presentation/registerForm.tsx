import placeholderImg from "@/assets/placeholder.svg";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardContent, cn, Field, FieldDescription, FieldGroup } from "yusr-ui";
import { useAppSelector } from "../../../core/state/store";
import AccountInfo from "./feildsInfo/accountInfo";
import AddressInfo from "./feildsInfo/addressInfo";
import CompanyInfo from "./feildsInfo/companyInfo";

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
  const { t } = useTranslation("loginRegister");
  const { loading, currentStep, acceptPolicies } = useAppSelector((state) => state.register);
  const steps = t("register.steps", { returnObjects: true }) as string[];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={ cn("flex flex-col gap-6", className) } { ...props }>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{ t("register.title") }</h1>
                <p className="text-muted-foreground text-balance">{ t("register.subtitle") }</p>
              </div>

              <div className="flex items-center justify-between gap-2">
                { steps.map((step, index) => (
                  <div key={ index } className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={ cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                        index < currentStep && "border-primary bg-primary text-primary-foreground",
                        index === currentStep && "border-primary text-primary",
                        index > currentStep && "border-muted-foreground/30 text-muted-foreground/30"
                      ) }
                    >
                      { index + 1 }
                    </div>
                    <span
                      className={ cn(
                        "hidden text-xs md:block",
                        index === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                      ) }
                    >
                      { step }
                    </span>
                  </div>
                )) }
              </div>

              { currentStep === 0 && <CompanyInfo /> }
              { currentStep === 1 && <AddressInfo /> }
              { currentStep === 2 && <AccountInfo /> }

              <div className={ cn("flex gap-2", currentStep > 0 ? "justify-between" : "justify-end") }>
                { currentStep > 0 && (
                  <Field className="flex-1">
                    <Button type="button" variant="outline" onClick={ onPrevStep } disabled={ loading }>
                      { t("register.buttons.previous") }
                    </Button>
                  </Field>
                ) }
                <Field className="flex-1">
                  <Button
                    type="button"
                    disabled={ loading || (isLastStep && !acceptPolicies) }
                    onClick={ isLastStep ? onSubmit : onNextStep }
                  >
                    { loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
                    { isLastStep ? t("register.buttons.create") : t("register.buttons.next") }
                  </Button>
                </Field>
              </div>

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
