import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const english = await import("./en.json").then((file) => file.default)
const arabic = await import("./ar.json").then((file) => file.default)

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = i18n.dir(lng)
  document.documentElement.lang = lng
})

interface Translation {
  [key: string]: string | Translation
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const detect = (obj: Readonly<Translation>) => {
  const seen = new Set<string>()
  Object.values(obj).forEach((value): void => {
    if (typeof value !== "string") {
      detect(value)
      return
    }
    if (seen.has(value)) Error(`Duplicated translation value: ${value}`)
    else seen.add(value)
  })
}

await i18n.use(initReactI18next).init(
  {
    fallbackLng: "en",
    lng: "en",
    resources: {
      ar: { translation: arabic satisfies typeof english },
      en: { translation: english satisfies typeof arabic },
    },
  },
  () => {
    detect(english)
    detect(arabic)
  },
)

type DotNotation<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DotNotation<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`
}[keyof T]

export type TranslationKey = DotNotation<typeof english>

export default i18n
