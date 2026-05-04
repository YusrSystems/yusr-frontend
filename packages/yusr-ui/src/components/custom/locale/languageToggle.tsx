import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../pure/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../pure/dropdown-menu";
import { SidebarMenuButton } from "../../pure/sidebar";

export function LanguageToggle({ variant = "icon" }: { variant?: "icon" | "sidebar"; })
{
  const { t, i18n } = useTranslation("common");

  return (
    <DropdownMenu dir={ i18n.dir() }>
      <DropdownMenuTrigger asChild>
        { variant === "sidebar"
          ? (
            <SidebarMenuButton className="w-full justify-start gap-3 px-3">
              <div className="relative flex items-center justify-center shrink-0 size-4">
                <Globe className="h-4 w-4" />
              </div>
              <span className="font-medium">{ t("change_language") }</span>
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
        <DropdownMenuItem
          onClick={ () => i18n.changeLanguage("ar") }
          className={ i18n.language === "ar" ? "bg-accent text-accent-foreground" : "" }
        >
          { t("arabic") }
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={ () => i18n.changeLanguage("en") }
          className={ i18n.language === "en" ? "bg-accent text-accent-foreground" : "" }
        >
          { t("english") }
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
