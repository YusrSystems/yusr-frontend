import React, { Fragment } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../pure/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../pure/collapsible";

export type MainMenuItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
  hasAuth: boolean;
  hasSeparator?: boolean;
  subItems?: {
    title: string;
    url: string;
    hasAuth: boolean;
    hasSeparator?: boolean;
  }[];
};

export function SideBarMainMenu({ items }: { items: MainMenuItem[] }) {
  return (
    <SidebarGroup className="mt-5">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (!item.hasAuth) return null;

            if (item.subItems && item.subItems.length > 0) {
              const authorizedSubItems = item.subItems.filter(
                (sub) => sub.hasAuth,
              );

              if (authorizedSubItems.length === 0) return null;

              return (
                <Fragment key={item.title}>
                  <Collapsible
                    asChild
                    defaultOpen={false}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="w-full justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center shrink-0 size-4">
                              {item.icon}
                            </span>
                            <span className="font-medium truncate">
                              {item.title}
                            </span>
                          </div>
                          <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {authorizedSubItems.map((subItem) => (
                            <Fragment key={subItem.title}>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>

                              {/* Sub-item separator */}
                              {subItem.hasSeparator && (
                                <li
                                  className="h-px bg-border my-1"
                                  aria-hidden="true"
                                />
                              )}
                            </Fragment>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {item.hasSeparator && (
                    <li className="h-px bg-border my-2" aria-hidden="true" />
                  )}
                </Fragment>
              );
            }

            return (
              <Fragment key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      to={item.url}
                      className="flex items-center justify-start gap-3 w-full px-3"
                    >
                      <span className="flex items-center justify-center shrink-0 size-4">
                        {item.icon}
                      </span>
                      <span className="font-medium truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {item.hasSeparator && (
                  <li className="h-px bg-border my-2" aria-hidden="true" />
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
