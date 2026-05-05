import { useTranslation } from "react-i18next";

export default function LandingFooter()
{
  const { t } = useTranslation("landing");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground bg-muted/20">
      { t("footer.copyright", { year: currentYear }) }
    </footer>
  );
}
