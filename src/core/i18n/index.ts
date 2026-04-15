import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'
import { en } from './locales/en'
import { ja } from './locales/ja'

const i18n = new I18n({ en, ja })

i18n.defaultLocale = 'en'
i18n.locale = getLocales()[0]?.languageCode ?? 'en'
i18n.enableFallback = true

export function t(scope: string, options?: Record<string, string>): string {
  return i18n.t(scope, options)
}

export { i18n }
