<script lang="ts">
    import { fetchEquips, type EquipWithAuctionType } from '$lib/equip'
    import EquipSearchBar from '$lib/equip-search-bar.svelte'
    import { getEquipSearchContext, setEquipSearchContext } from '$lib/equip-search-context'
    import EquipTable from '$lib/equip-table.svelte'
    import { group, sort } from 'radash'
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    setEquipSearchContext()
    const { params, isEmpty, raw, setParams } = getEquipSearchContext()

    const isMounted = writable(false)
    $: data = doFetch({
        params: $raw,
        skip: !$isMounted || $isEmpty
    })

    onMount(() => ($isMounted = true))

    // @todo: make this ssr-friendly by pre-fetching in load function
    async function doFetch(opts: { params: URLSearchParams; skip?: boolean }) {
        if (opts.skip) {
            return []
        }

        const queryString = opts.params.toString()

        const equips = await fetchEquips(queryString)
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
        {#await data}
            loading...
        {:then groups}
            {#each groups as equips}
                <EquipTable data={equips} />
            {/each}
        {/await}
    </div>
</div>
