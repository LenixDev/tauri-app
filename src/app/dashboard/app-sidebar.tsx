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
import { useUser } from "@/hooks/use-user"
import { useTranslation } from "react-i18next"
import { DASHBOARD_ROUTES } from "@/lib"
import { useSide } from "@/hooks/use-side"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()
  const { t } = useTranslation()

  const data = {
    user: {
      name: "shadcn",
      email: user.identifier.toString(),
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("nav.main.settings"),
        url: "",
        icon: (
          <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
        ),
        items: [
          {
            title: t("nav.main.general"),
            url: "",
          },
          {
            title: t("nav.main.team"),
            url: "",
          },
          {
            title: t("nav.main.billing"),
            url: "",
          },
          {
            title: t("nav.main.limits"),
            url: "",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: t("nav.secondary.support"),
        url: "",
        icon: (
          <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />
        ),
      },
      {
        title: t("nav.secondary.feedback"),
        url: "",
        icon: (
          <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
        ),
      },
    ],
    projects: [
      {
        name: DASHBOARD_ROUTES.find((route) => route.route === "users")?.label() || "ERR",
        url: DASHBOARD_ROUTES.find((route) => route.route === "users")?.route || "ERR",
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
                <div className="grid flex-1 rtl:text-right text-sm leading-tight">
                  <span className="truncate font-medium">{t("institute.name")}</span>
                  <span className="truncate text-xs">{t("institute.plan")}</span>
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
