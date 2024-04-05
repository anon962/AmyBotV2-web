<script lang="ts">
    import type { Equip, EquipWithAuctionType } from '$lib/equip'
    import { getEquipSearchContext, setEquipSearchContext } from '$lib/equip-search-context'
    import EquipTable from '$lib/equip-table.svelte'
    import { createQuery } from '@tanstack/svelte-query'
    import { group, sort } from 'radash'
    import { derived } from 'svelte/store'

    setEquipSearchContext()
    const { params, isEmpty, raw, setParams } = getEquipSearchContext()

    const query = createQuery<EquipWithAuctionType[]>({
        queryKey: [$raw.toString()],
        queryFn: async () => {
            if ($isEmpty) {
                return []
            }

            let data: EquipWithAuctionType[] = []

            const super_url = new URL(import.meta.env.VITE_API_URL)
            super_url.pathname = 'super/search_equips'
            super_url.search = $raw.toString()

            const s_resp = await fetch(super_url)
            const s_data = (await s_resp.json()) as Equip[]
            s_data.forEach((eq) =>
                data.push({
                    ...eq,
                    auction: { ...eq.auction, type: 'S' }
                })
            )

            const kedama_url = new URL(import.meta.env.VITE_API_URL)
            kedama_url.pathname = 'kedama/search_equips'
            kedama_url.search = $raw.toString()

            const k_resp = await fetch(kedama_url)
            const k_data = (await k_resp.json()) as Equip[]
            k_data.forEach((eq) =>
                data.push({
                    ...eq,
                    auction: { ...eq.auction, type: 'K' }
                })
            )

            return data
        }
    })

    const groupedByName = derived(query, (query) => {
        const groups = group(query.data ?? [], (eq) => eq.name)
        let result = Object.values(groups) as EquipWithAuctionType[][]

        result = sort(result, (xs) => xs.length, true)

        return result
    })
</script>

<div class="p-4 flex flex-col gap-4 items-center">
    {#if $query.isSuccess}
        {#each $groupedByName as equips}
            <EquipTable data={equips} />
        {/each}
    {/if}
</div>
