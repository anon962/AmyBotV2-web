import daisyui from 'daisyui'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {},
        screens: {
            xs: '500px',
            ...defaultTheme.screens
        }
    },
    plugins: [daisyui],
    daisyui: {
        themes: ['dark', 'light', 'black', 'dim', 'dracula', 'forest', 'nord', 'retro', 'valentine']
    }
} satisfies Config
