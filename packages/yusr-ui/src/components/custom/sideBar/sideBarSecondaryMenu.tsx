import { LogOutIcon } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/cn";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../../pure/sidebar";
import { LanguageToggle } from "../locale/languageToggle";
import { ThemeToggle } from "../theme/themeToggle";
import { ShareMenuItem } from "./shareMenuItem";

export interface SideBarSecondaryMenuProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup>
{
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
  onLogout: () => void;
  LinkComponent?: React.ElementType;
}

export function SideBarSecondaryMenu({
  items,
  onLogout,
  LinkComponent = "a",
  ...props
}: SideBarSecondaryMenuProps)
{
  const { t } = useTranslation("common");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const itemsFontSize = "text-base font-semibold";

  return (
    <SidebarGroup { ...props }>
      <SidebarGroupContent>
        <SidebarMenu className={ isCollapsed ? "space-y-2" : "" }>
          { items.map((item) => (
            <SidebarMenuItem key={ item.title }>
              <SidebarMenuButton asChild className="w-full justify-between h-12">
                <Link
                  to={ item.url }
                  className="flex items-center justify-start gap-3 w-full px-3"
                >
                  <span className="flex items-center justify-center shrink-0 size-4">
                    { item.icon }
                  </span>

                  <span className={ cn("truncate ps-2", itemsFontSize) }>
                    { item.title }
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )) }

          <SidebarMenuItem className={ isCollapsed ? "space-y-2" : "" }>
            <LanguageToggle variant="sidebar" />
            <ThemeToggle variant="sidebar" />
          </SidebarMenuItem>

          <ShareMenuItem itemsFontSize={ itemsFontSize } />

          <SidebarMenuItem key="logout">
            <SidebarMenuButton asChild onClick={ onLogout } className="w-full justify-between h-12">
              <div className="flex items-center justify-start gap-3 w-full px-3 text-destructive cursor-pointer">
                <span className="flex items-center justify-center shrink-0 size-4">
                  <LogOutIcon />
                </span>
                <span className={ cn("truncate ps-2", itemsFontSize) }>{ t("logout") }</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
