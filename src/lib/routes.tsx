import { Dashboard } from "@/app/dashboard"
import { Users } from "@/app/dashboard/routes/users"
import i18n from "i18next"
import type { JSX } from "react"

export const ROUTES: Record<string, {
  label: () => string
  route: string
  element: () => JSX.Element
}> = {
  "/": {
    label: () => i18n.t("dashboard"),
    route: '/',
    element: Dashboard,
  },
  users: {
    label: () => i18n.t("nav.projects.items.users"),
    route: 'users',
    element: Users,
  },
} as const