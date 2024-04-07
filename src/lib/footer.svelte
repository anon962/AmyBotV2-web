<script lang="ts">
    import DiscordIcon from './icons/discord-icon.svelte'
    import GithubIcon from './icons/github-icon.svelte'
    import { getThemeContext } from './theme-context'
    import ThemePicker from './theme-picker.svelte'

    const { theme, isDarkTheme } = getThemeContext()
    $: iconVariant = $isDarkTheme ? ('dark' as const) : ('light' as const)
</script>

<footer class="mt-auto footer p-6 bg-base-200 text-base-content rounded flex">
    <ThemePicker />

    <nav class="w-full">
        <div class="w-full grid grid-flow-col gap-4 items-center justify-end">
            <a href="https://github.com/anon962/AmyBotV2-web" target="_blank">
                <GithubIcon width="24" height="24" variant={iconVariant} />
            </a>

            <a href="https://discord.gg/7W6y7ezd" target="_blank">
                <DiscordIcon width="24" height="24" variant={iconVariant} />
            </a>
        </div>
    </nav>
</footer>
