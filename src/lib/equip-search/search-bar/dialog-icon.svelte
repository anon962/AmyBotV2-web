<script lang="ts">
    import FilterIcon from '$lib/icons/filter-icon.svelte'

    export let active: boolean
</script>

<div class="relative" class:active>
    <div class="icon-container">
        <FilterIcon />
    </div>

    <div class="dot"></div>
</div>

<style lang="postcss">
    .active {
        & .dot {
            /* Colored circle */
            @apply rounded-full bg-red-600;
            height: 0.65rem;
            width: 0.65rem;

            /* Overlayed at top-right corner */
            position: absolute;
            top: 0%;
            right: -5%;
            z-index: 2;
        }

        & .icon-container {
            @apply text-primary;
        }
    }
</style>
