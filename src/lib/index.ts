import i18n from "i18next"

export const DASHBOARD_ROUTES = [
  {
    route: '/',
    label: i18n.t("dashboard")
  },
  {
    route: 'users',
    label: i18n.t("nav.projects.items.users")
  },
] as const

export const INSTITUTE_LOGO = "https://graph.facebook.com/insfpmohammadia/picture?type=large"