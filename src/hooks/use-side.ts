import { useTranslation } from "react-i18next"

export const useSide = () => {
  const { i18n } = useTranslation()
  return i18n.dir() === "rtl" ? "right" : "left"
}