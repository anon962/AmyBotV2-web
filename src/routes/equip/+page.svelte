<script lang="ts">
    import { navigating } from '$app/stores'
    import { type EquipWithAuctionType } from '$lib/equip-search/equip'
    import EquipTable from '$lib/equip-search/equip-table.svelte'
    import SearchBar from '$lib/equip-search/search-bar/search-bar.svelte'
    import { setEquipUrlContext } from '$lib/equip-search/url-context'
    import { group, sort } from 'radash'
    import type { PageData } from './$types'

    export let data: PageData

    setEquipUrlContext()

    function groupByName(equips: EquipWithAuctionType[]): EquipWithAuctionType[][] {
        const nameMap = group(equips ?? [], (eq) => eq.name)

        let groupsByName = Object.values(nameMap) as EquipWithAuctionType[][]
        groupsByName = sort(groupsByName, (xs) => xs.length, true)

        return groupsByName
    }
</script>

<!-- @todo: loading skeleton -->
<div class="flex flex-col items-center p-4 pt-8">
    <SearchBar />

    <div class="divider"></div>

    {#if $navigating}
        loading...
    {:else}
        <!-- @todo: handle zero results -->
        {#each groupByName(data.initEquips) as grp}
            <EquipTable data={grp} />
        {/each}
    {/if}
</div>

<!-- @todo: footer (source, discord, theme selector(?)) -->
