<script>
    import { setThemeContext } from '$lib/theme-context'
    import '../app.css'

    const { theme } = setThemeContext()
</script>

<div class="h-full" data-theme={$theme.toLowerCase()}>
    <slot />
</div>
