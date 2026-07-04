import React, { type PropsWithChildren } from "react";
import { SidebarContext, useSidebarContext, type YusrSidBarProps } from "#/hooks";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarProvider
} from "#/components/pure";
import { SideBarCompanyData, SideBarSecondaryMenu, YusrSideBarMainMenu } from "#/components/custom";
import { SidebarLogo } from "./sidebarLogo";
import { SideBarUserData } from "./sideBarUserData";


/**
 * A sidebar component for Yusuf UI.
 *
 * It provides a sidebar that can be collapsed and opened with a button.
 * The sidebar can be placed on the left or right side of the page.
 * It also provides a context for the sidebar items to access the sidebar state.
 * @param LinkComponent
 * @param logos
 * @param displayCompany
 * @param children
 * @param navMain
 * @param navSecondary
 * @param props
 */
export function YusrSideBar({
	LinkComponent = "a",
	logos,
	displayCompany = {
		name: "Yusr UI",
		logo: "/yusr-logo.png"
	},
	navMain,
	navSecondary,
	children,
	...props
}: React.ComponentProps<typeof Sidebar> & YusrSidBarProps & PropsWithChildren)
{
	return (
		<SidebarContext.Provider
			value={ {LinkComponent, logos, displayCompany, navMain, navSecondary} }
		>
			<SidebarProvider>
				<Sidebar collapsible="icon" side="right" { ...props }>
					{ children }
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
YusrSideBar.Header = function (): React.ReactElement
{
	const {displayCompany, logos} = useSidebarContext();
	const logoConfig: {
		full: { light: string; dark: string; };
		collapsed: { light: string; dark: string; };
	} = {
		full: {
			light: logos.logoFullLight,
			dark: logos.logoFullDark
		},
		collapsed: {
			light: logos.logoOnlyLight,
			dark: logos.logoOnlyDark
		}
	};
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarLogo logos={ logoConfig }/>
					{ displayCompany && <SideBarCompanyData company={ displayCompany }/> }
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
	LogoutHandler
}: {
	LogoutHandler?: () => Promise<void>;
}): React.ReactElement
{
	const {navMain, navSecondary, LinkComponent} = useSidebarContext();
	if (!navMain || !navSecondary)
	{
		return <SidebarContent></SidebarContent>;
	}
	return (
		<SidebarContent>
			<YusrSideBarMainMenu items={ navMain } LinkComponent={ LinkComponent }/>
			{ LogoutHandler !== undefined && (
				<SideBarSecondaryMenu
					items={ navSecondary }
					className="pt-10 mt-auto text-center"
					onLogout={ LogoutHandler }
					LinkComponent={ LinkComponent }
				/>
			) }
		</SidebarContent>
	);
};

YusrSideBar.Footer = function ()
{
	return (
		<SidebarFooter>
			<SideBarUserData/>
		</SidebarFooter>
	);
};
