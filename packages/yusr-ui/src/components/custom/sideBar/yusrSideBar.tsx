"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "../../pure/sidebar";
import {
  SidebarContext,
  useSidebarContext,
  type YusrSidBarProps,
} from "../../../hooks/useSidebarContext";
import type { PropsWithChildren } from "react";
import { SidebarLogo } from "./sidebarLogo";
import { SideBarCompanyData } from "./sideBarCompanyData";
import { YusrSideBarMainMenu } from "./yusrSideBarMainMenu";
import { SideBarSecondaryMenu } from "./sideBarSecondaryMenu";
import { SideBarUserData } from "./sideBarUserData";

/**
 * A sidebar component for Yusuf UI.
 *
 * It provides a sidebar that can be collapsed and opened with a button.
 * The sidebar can be placed on the left or right side of the page.
 * It also provides a context for the sidebar items to access the sidebar state.
 *
 * @param {React.ComponentProps<typeof Sidebar>} props The props for the sidebar.
 * @param {YusrSidBarProps} props The props for the sidebar items.
 * @param {PropsWithChildren} props The props with children for the sidebar.
 * @param {React.ReactNode} [LinkComponent="a"] The component to use for the links in the sidebar.
 * @param {React.ReactNode} [logos] The logos to display in the sidebar.
 * @param {boolean} [displayCompany] Whether to display the company information in the sidebar.
 * @param {YusrSidBarMainMenuProps["items"]} [navMain] The main navigation items for the sidebar.
 * @param {YusrSidBarMainMenuProps["items"]} [navSecondary] The secondary navigation items for the sidebar.
 * @param {React.ReactNode} [children] The children of the sidebar component.
 */
export function YusrSideBar({
  LinkComponent = "a",
  logos,
  displayCompany = {
    name: "Yusr UI",
    logo: "/yusr-logo.png",
  },
  navMain,
  navSecondary,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & YusrSidBarProps & PropsWithChildren) {
  return (
    <SidebarContext.Provider
      value={{ LinkComponent, logos, displayCompany, navMain, navSecondary }}
    >
      <SidebarProvider>
        <Sidebar collapsible="icon" side="right" {...props}>
          {children}
        </Sidebar>
      </SidebarProvider>
    </SidebarContext.Provider>
  );
}

/**
 * A header component for the sidebar.
 * It displays the logo and company information.
 * @returns {React.ReactElement} The header component.
 */
YusrSideBar.Header = function () {
  const { displayCompany, logos } = useSidebarContext();
  const logoConfig: {
    full: { light: string; dark: string };
    collapsed: { light: string; dark: string };
  } = {
    full: {
      light: logos.logoFullLight,
      dark: logos.logoFullDark,
    },
    collapsed: {
      light: logos.logoOnlyLight,
      dark: logos.logoOnlyDark,
    },
  };
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarLogo logos={logoConfig} />
          {displayCompany && <SideBarCompanyData company={displayCompany} />}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

/**
 * A content component for the sidebar.
 * It displays the main navigation items and the logout button if LogoutHandler is defined.
 * @param {LogoutHandler?: () => Promise<void>} [LogoutHandler] A function to be called when the logout button is clicked.
 * @return {React.ReactElement} The content component.
 */
YusrSideBar.Content = function ({
  LogoutHandler,
}: {
  LogoutHandler?: () => Promise<void>;
}) {
  const { navMain, navSecondary, LinkComponent } = useSidebarContext();
  if (!navMain || !navSecondary) return <SidebarContent></SidebarContent>;
  return (
    <SidebarContent>
      <YusrSideBarMainMenu items={navMain} LinkComponent={LinkComponent} />
      {LogoutHandler !== undefined && (
        <SideBarSecondaryMenu
          items={navSecondary}
          className="pt-10 mt-auto text-center"
          onLogout={LogoutHandler}
          LinkComponent={LinkComponent}
        />
      )}
    </SidebarContent>
  );
};

YusrSideBar.Footer = function ({
  loggedInUser = undefined,
}: {
  loggedInUser?: any;
}) {
  return (
    <SidebarFooter>
      <SideBarUserData user={loggedInUser} />
    </SidebarFooter>
  );
};
