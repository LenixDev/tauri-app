import i18n from "i18next"

export const DASHBOARD_ROUTES = [
  {
    label: () => i18n.t("dashboard"),
    route: '/',
  },
  {
    label: () => i18n.t("nav.projects.items.users"),
    route: 'users'
  },
] as const