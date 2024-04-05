<script lang="ts">
    import type { Equip } from '$lib/equip'
    import { getEquipSearchContext, setEquipSearchContext } from '$lib/equip-search-context'
    import EquipTable from '$lib/equip-table.svelte'
    import { createQuery } from '@tanstack/svelte-query'
    import { group } from 'radash'
    import { derived } from 'svelte/store'

    setEquipSearchContext()
    const { params, isEmpty, raw, setParams } = getEquipSearchContext()

    const query = createQuery<Equip[]>({
        queryKey: [$raw.toString()],
        queryFn: async () => {
            if ($isEmpty) {
                return []
            }

            const url = new URL(import.meta.env.VITE_API_URL)
            url.pathname = 'super/search_equips'
            url.search = $raw.toString()

            const resp = await fetch(url)
            const data = await resp.json()
            return data
        }
    })

    const groupedByName = derived(query, (query) => {
        let byName = group(query.data ?? [], (eq) => eq.name)
        return Object.values(byName) as Equip[][]
    })
</script>

<div class="overflow-y-auto p-4 flex flex-col gap-4">
    {#if $query.isSuccess}
        {#each $groupedByName as equips}
            <EquipTable data={equips} />
        {/each}
    {/if}
</div>
