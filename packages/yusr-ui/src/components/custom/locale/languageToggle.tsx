import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../pure/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../pure/dropdown-menu";
import { SidebarMenuButton } from "../../pure/sidebar";

const LANGUAGES = [{ code: "ar", label: "arabic" }, { code: "ur", label: "urdu" }, {
  code: "en",
  label: "english"
}, {
  code: "bn",
  label: "bengali"
}, {
  code: "hi",
  label: "hindi"
}] as const;

export function LanguageToggle({ variant = "icon" }: { variant?: "icon" | "sidebar"; })
{
  const { t, i18n } = useTranslation("common");

  return (
    <DropdownMenu dir={ i18n.dir() }>
      <DropdownMenuTrigger asChild>
        { variant === "sidebar"
          ? (
            <SidebarMenuButton className="w-full justify-start gap-3 px-3 h-12">
              <div className="relative flex items-center justify-center shrink-0 size-4">
                <Globe className="h-4 w-4" />
              </div>
              <span className="font-medium text-base ps-2">{ t("change_language") }</span>
            </SidebarMenuButton>
          )
          : (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Globe className="h-4 w-4" />
              <span className="sr-only">{ t("change_language") }</span>
            </Button>
          ) }
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        { LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            key={ code }
            onClick={ () => i18n.changeLanguage(code) }
            className={ `flex items-center gap-2 ${i18n.language === code ? "bg-accent text-accent-foreground" : ""}` }
          >
            { t(label) }
          </DropdownMenuItem>
        )) }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
