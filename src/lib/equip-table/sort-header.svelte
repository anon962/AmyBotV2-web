<script context="module" lang="ts">
    type SortState = null | 'desc' | 'asc'
</script>

<script lang="ts">
    import DownIcon from '$lib/icons/down-icon.svelte'
    import UpIcon from '$lib/icons/up-icon.svelte'

    export let tag: 'th' | 'td'
    export let state: SortState
    export let classes: string = ''

    $: asc = state === 'asc'
    $: desc = state === 'desc'
</script>

<svelte:element this={tag} class:asc class:desc class="my-container {classes}">
    <button on:click class="normal-case">
        <span class="flex gap-1">
            <slot />

            <span class="my-icon-container w-4">
                {#if state === 'asc'}
                    <UpIcon />
                {:else}
                    <DownIcon />
                {/if}
            </span>
        </span>
    </button>
</svelte:element>

<style lang="postcss">
    /* Hide icon until hovered or active sort */
    .my-icon-container {
        visibility: hidden;
        opacity: 0.5;
    }
    .my-container:hover .my-icon-container {
        visibility: visible;
    }
    .my-container.asc .my-icon-container,
    .my-container.desc .my-icon-container {
        visibility: visible;
        opacity: 1;
    }

    .my-icon-container > :global(svg) {
        width: 1rem;
        height: 1rem;
    }
</style>
