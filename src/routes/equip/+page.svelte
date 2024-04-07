<script lang="ts">
    import { navigating } from '$app/stores'
    import { type EquipWithAuctionType } from '$lib/equip-search/equip'
    import EquipTable from '$lib/equip-search/equip-table.svelte'
    import SearchBar from '$lib/equip-search/search-bar/search-bar.svelte'
    import { setEquipUrlContext } from '$lib/equip-search/url-context'
    import { draw, group, sort } from 'radash'
    import type { PageData } from './$types'

    export let data: PageData

    const { isEmpty } = setEquipUrlContext()

    function groupByName(equips: EquipWithAuctionType[]): EquipWithAuctionType[][] {
        const nameMap = group(equips ?? [], (eq) => eq.name)

        let groupsByName = Object.values(nameMap) as EquipWithAuctionType[][]
        groupsByName = sort(groupsByName, (xs) => xs.length, true)

        return groupsByName
    }

    function getRandomQuery(): string {
        const rarities = ['magn', 'legend', 'peerl']

        const categories = [
            'plate',
            'power',
            'leather',
            'shade',
            'cotton',
            'phase',
            'staff',
            'sword',
            'club',
            'katana',
            'shield'
        ]

        const rarity = draw(rarities)
        const cat = draw(categories) as string

        const query = `?name=${rarity},${cat}`
        return query
    }
</script>

<!-- @todo: loading skeleton -->
<div class="flex flex-col items-center p-4 pt-8">
    <SearchBar />

    <div class="divider"></div>

    {#if $navigating}
        loading...
    {:else if $isEmpty}
        <div class="text-center">
            No idea what to search?
            <br />
            Click <a href={getRandomQuery()} class="link">here</a> for a random one!
        </div>
    {:else if !data.initEquips.length}
        no results
    {:else}
        <!-- @todo: handle zero results -->
        {#each groupByName(data.initEquips) as grp}
            <EquipTable data={grp} />
        {/each}
    {/if}
</div>

<!-- @todo: footer (source, discord, theme selector(?)) -->
