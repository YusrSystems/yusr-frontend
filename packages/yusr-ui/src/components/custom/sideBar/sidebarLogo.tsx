import { useSidebar } from "../../pure/sidebar";

export interface SidebarLogoProps {
  logos: {
    full: {
      light: string;
      dark: string;
      sizeStyle?: string;
    };
    collapsed: {
      light: string;
      dark: string;
      sizeStyle?: string;
    };
  };
  alt?: string;
}

export function SidebarLogo({ logos, alt = "Logo" }: SidebarLogoProps)
{
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={`
        animate-fadeSlide transition-all duration-300 pb-3
        ${isCollapsed ? logos.collapsed.sizeStyle || "w-8" : logos.full.sizeStyle || "w-35 px-2"} 
      `}
    >
      {/* Light Mode Logo */}
      <img
        src={isCollapsed ? logos.collapsed.light : logos.full.light}
        alt={alt}
        className="block dark:hidden transition-all duration-300 h-auto object-contain w-full"
      />

      {/* Dark Mode Logo */}
      <img
        src={isCollapsed ? logos.collapsed.dark : logos.full.dark}
        alt={alt}
        className="hidden dark:block transition-all duration-300 h-auto object-contain w-full"
      />
    </div>
  );
}
