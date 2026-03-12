import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const english = await import("./en.json").then(m => m.default)
const arabic = await import("./ar.json").then(m => m.default)

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = i18n.dir(lng)
})

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: english satisfies typeof arabic },
    ar: { translation: arabic satisfies typeof english },
  },
  lng: "en",
  fallbackLng: "en",
})

export default i18n