import ui from '~~/content/ui.json'

export type Locale = 'en' | 'mk'
export type Localized<T = string> = Record<Locale, T>

const LOCALES: Locale[] = ['en', 'mk']
const COOKIE = 'ts_locale'

const isLocale = (v: unknown): v is Locale => typeof v === 'string' && LOCALES.includes(v as Locale)

/**
 * Minimal MK/EN locale layer. Content lives as `{ en, mk }` objects so that
 * swapping in @nuxtjs/i18n or a database later is a drop-in change.
 */
export const useLocale = () => {
  const cookie = useCookie<Locale>(COOKIE, { default: () => 'en', sameSite: 'lax' })
  const locale = useState<Locale>('locale', () => (isLocale(cookie.value) ? cookie.value : 'en'))

  const setLocale = (next: Locale) => {
    if (!isLocale(next)) return
    locale.value = next
    cookie.value = next
    if (import.meta.client) document.documentElement.lang = next
  }

  const toggle = () => setLocale(locale.value === 'en' ? 'mk' : 'en')

  /** Pick the current language from a `{ en, mk }` object. */
  const l = <T>(v: Localized<T> | undefined): T | undefined => v?.[locale.value] ?? v?.en

  /** Dot-path lookup into content/ui.json, e.g. t('nav.collection'). */
  const t = (path: string): string => {
    const node = path.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], ui)
    const value = l(node as Localized | undefined)
    return typeof value === 'string' ? value : path
  }

  return { locale, locales: LOCALES, setLocale, toggle, l, t }
}
