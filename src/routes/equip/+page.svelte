<script context="module" lang="ts">
    type GroupCriteria = 'name' | 'buyer' | 'seller'
    type EquipAccessor = (eq: EquipWithAuctionType) => string
</script>

<script lang="ts">
    import { navigating } from '$app/stores'
    import { type EquipWithAuctionType } from '$lib/equip-search/equip'
    import SearchBar from '$lib/equip-search/search-bar/search-bar.svelte'
    import { setEquipUrlContext } from '$lib/equip-search/url-context'
    import EquipTable from '$lib/equip-table/equip-table.svelte'
    import Footer from '$lib/footer.svelte'
    import { draw, group, range, sort } from 'radash'
    import { derived, writable, type Writable } from 'svelte/store'
    import type { PageData } from './$types'

    export let data: PageData

    const { params, isEmpty } = setEquipUrlContext()

    let groupCriteria: Writable<GroupCriteria> = writable('name')
    $: {
        if ($params.seller || $params.seller_partial) {
            $groupCriteria = 'seller'
        } else if ($params.buyer || $params.buyer_partial) {
            $groupCriteria = 'buyer'
        } else {
            $groupCriteria = 'name'
        }
    }

    let accessor = derived(groupCriteria, ($groupCriteria) => getEquipAccessor($groupCriteria))

    function groupBy(
        equips: EquipWithAuctionType[],
        accessor: EquipAccessor
    ): EquipWithAuctionType[][] {
        const grouped = group(equips ?? [], accessor)

        let groupValues = Object.values(grouped) as EquipWithAuctionType[][]
        groupValues = sort(groupValues, (xs) => xs.length, true)

        return groupValues
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

    function getEquipAccessor(criteria: GroupCriteria): EquipAccessor {
        switch (criteria) {
            case 'name':
                return (eq) => eq.name
            case 'buyer':
                return (eq) => eq.buyer
            case 'seller':
                return (eq) => eq.seller
        }
    }
</script>

<div class="min-h-full flex flex-col">
    <div class="p-4 pt-8 flex flex-col items-center">
        <SearchBar />

        <div class="divider mb-2"></div>

        <div class="my-list w-full flex flex-col">
            <div class="w-full flex justify-end gap-2">
                <select
                    name="group-by"
                    class="select select-bordered select-xs"
                    bind:value={$groupCriteria}
                >
                    <option value="name">Group by equip name</option>
                    <option value="seller">Group by seller</option>
                    <option value="buyer">Group by buyer</option>
                </select>
            </div>

            {#if $navigating || 0}
                <div class="h-full w-full flex flex-col gap-4 pt-4">
                    {#each range(12) as _}
                        <div class="skeleton h-[56px]"></div>
                    {/each}
                </div>
            {:else if $isEmpty}
                <div class="text-center">
                    No idea what to search?
                    <br />
                    <a href={getRandomQuery()} class="link">Try a random search!</a>
                </div>
            {:else if !data.initEquips.length}
                No equips found
            {:else}
                {#each groupBy(data.initEquips, $accessor) as grp}
                    <EquipTable data={grp} label={$accessor(grp[0])} />
                {/each}
            {/if}
        </div>
    </div>

    <Footer />
</div>

<style lang="postcss">
    .my-list {
        max-width: min(1200px, 90vw);
    }
</style>
