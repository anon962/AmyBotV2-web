<script lang="ts">
    import { navigating } from '$app/stores'
    import { type EquipWithAuctionType } from '$lib/equip'
    import EquipSearchBar from '$lib/equip-search-bar.svelte'
    import { setEquipSearchContext } from '$lib/equip-search-context'
    import EquipTable from '$lib/equip-table.svelte'
    import { group, sort } from 'radash'
    import type { PageData } from './$types'

    export let data: PageData

    setEquipSearchContext()

    function groupByName(equips: EquipWithAuctionType[]): EquipWithAuctionType[][] {
        const nameMap = group(equips ?? [], (eq) => eq.name)

        let groupsByName = Object.values(nameMap) as EquipWithAuctionType[][]
        groupsByName = sort(groupsByName, (xs) => xs.length, true)

        return groupsByName
    }
</script>

<!-- @todo loading skeleton -->
<div class="flex flex-col items-center p-4 pt-8 gap-4">
    <EquipSearchBar />

    <div class="divider"></div>

    {#if $navigating}
        loading...
    {:else}
        {#each groupByName(data.initEquips) as grp}
            <EquipTable data={grp} />
        {/each}
    {/if}
</div>
