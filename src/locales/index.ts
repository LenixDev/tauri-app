import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const english = await import("./en.json").then(m => m.default)
const arabic = await import("./ar.json").then(m => m.default)

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = i18n.dir(lng)
  document.documentElement.lang = lng
})

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: english satisfies typeof arabic },
    ar: { translation: arabic satisfies typeof english },
  },
  lng: "ar",
  fallbackLng: "en",
})

type DotNotation<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DotNotation<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`
}[keyof T]

export type TranslationKey = DotNotation<typeof english>

export default i18n