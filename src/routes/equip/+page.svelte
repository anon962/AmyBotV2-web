<script lang="ts">
    import { fetchEquips, type EquipWithAuctionType } from '$lib/equip'
    import EquipSearchBar from '$lib/equip-search-bar.svelte'
    import { getEquipSearchContext, setEquipSearchContext } from '$lib/equip-search-context'
    import EquipTable from '$lib/equip-table.svelte'
    import { createQuery } from '@tanstack/svelte-query'
    import { group, sort } from 'radash'
    import { onMount } from 'svelte'
    import { derived, writable } from 'svelte/store'

    setEquipSearchContext()
    const { params, isEmpty, raw, setParams } = getEquipSearchContext()

    // @todo: make this ssr-friendly by pre-fetching in load function
    const isMounted = writable(false)
    const query = createQuery<EquipWithAuctionType[]>({
        // @todo: This enabled flag doesn't work, but probably not my fault
        // enabled: $isMounted,
        queryKey: [$raw.toString()],
        queryFn: async () => {
            if ($isEmpty) {
                return []
            }

            if (!$isMounted) {
                throw Error('not mounted')
            }

            return fetchEquips($raw)
        }
    })

    const groupedByName = derived(query, (query) => {
        const groups = group(query.data ?? [], (eq) => eq.name)
        let result = Object.values(groups) as EquipWithAuctionType[][]

        result = sort(result, (xs) => xs.length, true)

        return result
    })

    onMount(() => ($isMounted = true))
</script>

<!-- @todo loading skeleton -->
<div class="flex flex-col items-center p-4">
    <EquipSearchBar />

    <div class="p-4 flex flex-col gap-4 items-center">
        {#if $query.isSuccess}
            {#each $groupedByName as equips}
                <EquipTable data={equips} />
            {/each}
        {/if}
    </div>
</div>
