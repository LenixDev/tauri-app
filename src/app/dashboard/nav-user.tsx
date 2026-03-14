"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon, CheckmarkBadgeIcon, NotificationIcon, LogoutIcon } from "@hugeicons/core-free-icons"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { useTranslation } from "react-i18next"
import { useDir } from "@/hooks/use-dir"

export const NavUser = ({
  user,
}: Readonly<{
  user: {
    name: string
    email: string
    avatar: string
  }
}>) => {
  const { isMobile } = useSidebar()
  const authUser = useUser()
  const navigate = useNavigate()
  const signOut = async () => {
    const [success, result] = await authUser.signOut()
    if (!success) {
      toast.error(result)
      return
    }
    toast.success(t(result))
    navigate("/login")
  }
  const { t, i18n } = useTranslation()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu dir={useDir()}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`rtl:text-right data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground`}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel dir={useDir()} className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 rtl:text-right text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={CheckmarkBadgeIcon} strokeWidth={2} />
                {t("nav.user.account")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
                {t("nav.user.notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Select onValueChange={async (value) => { await i18n.changeLanguage(value) }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("nav.user.change_language")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("nav.user.languages")}</SelectLabel>
                  <SelectItem value="en" disabled={i18n.language === "en"}>{t("nav.user.english")}</SelectItem>
                  <SelectItem value="ar" disabled={i18n.language === "ar"}>{t("nav.user.arabic")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <HugeiconsIcon icon={LogoutIcon} className="rtl:rotate-180" strokeWidth={2} />
              {t("nav.user.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
