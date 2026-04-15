import { Moon, Sun } from "lucide-react";

import { Button } from "../../pure/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../pure/dropdown-menu";
import { SidebarMenuButton } from "../../pure/sidebar";
import { useTheme } from "./themeProvider";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "sidebar"; })
{
  const { setTheme } = useTheme();

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        { variant === "sidebar"
          ? (
            <SidebarMenuButton className="w-full justify-start gap-3 px-3">
              <div className="relative flex items-center justify-center shrink-0 size-4">
                <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </div>
              <span className="font-medium">تغيير المظهر</span>
            </SidebarMenuButton>
          )
          : (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">تغيير الثمة</span>
            </Button>
          ) }
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={ () => setTheme("light") }>فاتح</DropdownMenuItem>
        <DropdownMenuItem onClick={ () => setTheme("dark") }>داكن</DropdownMenuItem>
        <DropdownMenuItem onClick={ () => setTheme("system") }>النظام</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
