import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardContent } from "yusr-ui";

export default function Welcome()
{
  const { t } = useTranslation("loginRegister");
  const navigate = useNavigate();

  return (
    <Card className="w-100 max-w-100">
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
          <div className="relative flex items-center justify-center">
            <span
              className="absolute inline-flex h-20 w-20 rounded-full bg-green-600/20"
              style={ { animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" } }
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10 ring-4 ring-green-600/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={ 2.5 }
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              { t("register.welcome.title") }
            </h2>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              { t("register.welcome.subtitle") }
            </p>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-3">
            <Button onClick={ () => navigate("/login") } className="w-full" size="lg">
              <Link to="/login">
                { t("register.welcome.button") }
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
