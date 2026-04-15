import { Avatar, AvatarFallback, AvatarImage } from "../../pure/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../pure/sidebar";

export function SideBarCompanyData({ company }: { company: { name: string; logo: string; }; })
{
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={ company.logo } alt={ company.name } />
            <AvatarFallback className="rounded-lg">YSR</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-medium">{ company.name }</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
