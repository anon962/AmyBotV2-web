<script lang="ts">
    import FilterIcon from '$lib/icons/filter-icon.svelte'

    export let active: boolean
</script>

<div class="relative" class:active>
    <div class="icon-container">
        <FilterIcon class="w-6 h-6" />
    </div>

    <div class="dot"></div>
</div>

<style lang="postcss">
    .active {
        & .dot {
            /* Colored circle */
            @apply rounded-full bg-red-600;
            height: 0.5rem;
            width: 0.5rem;

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
