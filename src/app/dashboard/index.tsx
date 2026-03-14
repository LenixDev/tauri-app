import { AppSidebar } from "@/app/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSide } from "@/hooks/use-side"
import React from "react"
import { NavLink, Outlet, useLocation } from "react-router"
import { ROUTES } from "@/lib/routes"

export const Dashboard = () => {
  const { pathname } = useLocation()
  const directories = ["/", ...pathname.split("/").filter(Boolean)]
  const side = useSide()
  return (
    <SidebarProvider>
      <AppSidebar side={side} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 rtl:rotate-180" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {directories.map((directory, index) => {
                  const isLastRoute = directories.length === index + 1
                  const directoryLabel = ROUTES[directory].label()
                  return isLastRoute ? (
                    <BreadcrumbItem key={directory}>
                      <BreadcrumbPage>{directoryLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <React.Fragment key={directory}>
                      <BreadcrumbItem className="hidden md:block">
                        <NavLink to={directory}>
                          {directoryLabel}
                        </NavLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block rtl:rotate-180" />
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  )
}
