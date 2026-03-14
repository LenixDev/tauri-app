import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import { useDir } from "@/hooks/use-dir"

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const NavMain = ({
  items,
}: {
  readonly items: {
    title: string
    url: string
    icon: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) => {
  const { t } = useTranslation()
  const dir = useDir()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("nav.main.title")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {(item.items?.length ?? 0) > 0 ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className={
                        `rtl:left-1 rtl:right-auto data-[state=open]:${dir === 'rtl' ? '-' : ''}rotate-90`
                      }
                    >
                      <HugeiconsIcon className="rtl:rotate-180" icon={ArrowRight01Icon} strokeWidth={2} />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="rtl:border-l-0 rtl:border-r">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
