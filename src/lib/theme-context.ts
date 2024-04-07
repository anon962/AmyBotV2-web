import { getContext, setContext } from 'svelte'
import { derived, writable, type Readable } from 'svelte/store'

export const THEME_VARIANTS = [
    'Dark',
    'Light',
    'Black',
    'Dim',
    'Dracula',
    'Forest',
    'Nord',
    'Retro',
    'Valentine'
] as const
export type ThemeVariant = (typeof THEME_VARIANTS)[number]

export const DARK_THEMES: ThemeVariant[] = ['Dark', 'Black', 'Dim', 'Dracula', 'Forest']

export type ThemeValue = {
    theme: Readable<ThemeVariant>
    isDarkTheme: Readable<boolean>

    setTheme: (theme: ThemeVariant) => void
}

const KEY = 'theme'

const STORAGE_KEY = KEY

export function setThemeContext() {
    // Load default from system preference
    const prefersLight = checkPrefersLight()
    const defaultTheme: ThemeVariant = prefersLight ? 'Retro' : 'Dark'

    // Load override from local storage
    const prefTheme = checkLocalStorage()

    const theme = writable(prefTheme ?? defaultTheme)

    const isDarkTheme = derived(theme, ($theme) => DARK_THEMES.includes($theme))

    const value = { theme, isDarkTheme, setTheme }
    setContext<ThemeValue>(KEY, value)

    return value

    function setTheme(variant: ThemeVariant) {
        theme.set(variant)
        console.log()
        localStorage.setItem(STORAGE_KEY, variant)
    }

    function checkPrefersLight(): boolean {
        if (typeof window === 'undefined') {
            return false
        }

        return window.matchMedia('(prefers-color-scheme: light)').matches
    }

    function checkLocalStorage(): ThemeVariant | null {
        if (typeof window === 'undefined') {
            return null
        }

        const val = window.localStorage.getItem(STORAGE_KEY)
        if (val === null) {
            return null
        }

        for (let opt of THEME_VARIANTS) {
            if (opt === val) {
                return opt
            }
        }

        return null
    }
}

export function getThemeContext() {
    return getContext(KEY) as ThemeValue
}
