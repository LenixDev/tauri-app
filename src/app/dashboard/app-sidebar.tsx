"use client"

import * as React from "react"

import { NavMain } from "@/app/dashboard/nav-main"
import { NavProjects } from "@/app/dashboard/nav-projects"
import { NavSecondary } from "@/app/dashboard/nav-secondary"
import { NavUser } from "@/app/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings05Icon, ChartRingIcon, SentIcon, CommandIcon, ManagerFreeIcons } from "@hugeicons/core-free-icons"
import { Link } from "react-router"
import { useAuth, useUser } from "@/hooks/use-hook"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()
  
  const data = {
    user: {
      name: "shadcn",
      email: user.getIdentification.toString(),
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Settings",
        url: "",
        icon: (
          <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
        ),
        items: [
          {
            title: "General",
            url: "",
          },
          {
            title: "Team",
            url: "",
          },
          {
            title: "Billing",
            url: "",
          },
          {
            title: "Limits",
            url: "",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "",
        icon: (
          <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />
        ),
      },
      {
        title: "Feedback",
        url: "",
        icon: (
          <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
        ),
      },
    ],
    projects: [
      {
        name: "Manage Users",
        url: "users",
        icon: (
          <HugeiconsIcon icon={ManagerFreeIcons} strokeWidth={2} />
        ),
      },
    ],
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon icon={CommandIcon} strokeWidth={2} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
