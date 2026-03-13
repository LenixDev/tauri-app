import { useTranslation } from "react-i18next"

export const useRotate = () => {
  const { i18n } = useTranslation()
  return i18n.dir() === 'rtl' ? 'rotate-180' : ''
}