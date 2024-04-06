<script lang="ts" generics="T">
    // Component that picks one of the following slots
    //   async-load - data is loading
    //   async-data - data is loaded
    //   override   - enabled by flag
    //                (mainly to skip the await if the data already exists from ssr
    //                 because otherwise there would be jittering as promises settle)

    export let showOverride: boolean
    export let asyncData: Promise<T>
    export let classes: string = ''
</script>

<div class={classes}>
    {#if showOverride}
        <slot name="override" />
    {:else}
        {#await asyncData}
            <slot name="async-load" />
        {:then data}
            <slot name="async-data" {data} />
        {/await}
    {/if}
</div>
