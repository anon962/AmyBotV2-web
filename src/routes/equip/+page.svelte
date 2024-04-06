<script lang="ts">
    import { fetchEquips, type EquipWithAuctionType } from '$lib/equip'
    import EquipSearchBar from '$lib/equip-search-bar.svelte'
    import { getEquipSearchContext, setEquipSearchContext } from '$lib/equip-search-context'
    import EquipTable from '$lib/equip-table.svelte'
    import { group, sort } from 'radash'
    import type { PageData } from './$types'

    export let data: PageData

    setEquipSearchContext()
    const { params, isEmpty, raw, setParams } = getEquipSearchContext()

    // If data was loaded during SSR, skip the fetch
    $: isInitQuery = $raw.toString() === data.initQueryString

    $: query = doFetch({
        params: $raw,
        skip: isInitQuery || $isEmpty
    })

    async function doFetch(opts: { params: URLSearchParams; skip?: boolean }) {
        if (opts.skip) {
            return []
        }

        const queryString = opts.params.toString()
        const equips = await fetchEquips(queryString)
        return equips
    }

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

    <div class="flex flex-col gap-4 items-center max-w-[65rem]">
        {#if isInitQuery}
            {#each groupByName(data.initEquips) as grp}
                <EquipTable data={grp} />
            {/each}
        {:else}
            {#await query}
                loading...
            {:then equips}
                {#each groupByName(equips) as grp}
                    <EquipTable data={grp} />
                {/each}
            {/await}
        {/if}
    </div>
</div>
