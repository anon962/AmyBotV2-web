<script lang="ts">
    import { THEME_VARIANTS, getThemeContext, type ThemeVariant } from './theme-context'

    let selectEl: HTMLSelectElement

    const { theme, setTheme } = getThemeContext()

    function handleChange() {
        setTheme(selectEl.value as ThemeVariant)
    }
</script>

<select
    bind:this={selectEl}
    on:change={handleChange}
    class="select select-bordered select-sm flex items-center"
    value={$theme}
>
    {#each THEME_VARIANTS as theme}
        <option value={theme}>
            {theme}
        </option>
    {/each}
</select>
