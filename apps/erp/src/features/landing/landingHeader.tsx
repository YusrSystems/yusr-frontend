import logoDark from "@/assets/yusrLogoOnly_Dark.png";
import logoLight from "@/assets/yusrLogoOnly_Light.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, LanguageToggle, ThemeToggle } from "yusr-ui";

export default function LandingHeader()
{
  const { t } = useTranslation("common");

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg">
      <div className="mx-auto flex ltr:flex-row-reverse max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center w-10">
          <img
            src={ logoLight }
            alt="يُسر"
            className="block dark:hidden h-auto w-full object-contain"
          />
          <img
            src={ logoDark }
            alt="يُسر"
            className="hidden dark:block h-auto w-full object-contain"
          />
        </div>

        <div className="flex ltr:flex-row-reverse items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />
          <Link to="/login">
            <Button size="lg" variant="outline">
              { t("login") }
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="default">
              { t("register") }
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
