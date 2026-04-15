import { createContext, useContext, type JSX } from "react";

export type YusrSidBarProps = {
  LinkComponent?: React.ElementType;

  logos: {
    logoFullDark: string;
    logoFullLight: string;
    logoOnlyDark: string;
    logoOnlyLight: string;
  };
  displayCompany?: {
    name: string;
    logo: string;
  };
  navMain?: {
    title: string;
    url: string;
    icon: JSX.Element;
    hasAuth: boolean;
  }[];
  navSecondary?: {
    title: string;
    url: string;
    icon: JSX.Element;
  }[];
};

export const SidebarContext = createContext<YusrSidBarProps | null>(null);

/**
 * Returns the props of the nearest SidebarProvider.
 * Must be used within a SidebarProvider.
 * @returns {YusrSidBarProps} The props of the nearest SidebarProvider.
 */
export const useSidebarContext = (): YusrSidBarProps => {
  const sidebarContext = useContext(SidebarContext);
  if (!sidebarContext) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return sidebarContext;
};
