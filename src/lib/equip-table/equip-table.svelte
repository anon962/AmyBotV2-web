<script lang="ts" context="module">
    type Column = 'price' | 'level' | 'date' | 'auction' | 'buyer' | 'seller' | 'id'
    type ActiveSort = { col: Column; type: 'asc' | 'desc' }

    type EquipAccessor<T> = (eq: EquipWithAuctionType) => T
</script>

<script lang="ts">
    import { getDate } from '$lib/utils'
    import { alphabetical, sort } from 'radash'
    import { writable } from 'svelte/store'
    import type { EquipWithAuctionType } from '../equip-search/equip'
    import SortHeader from './sort-header.svelte'

    export let data: EquipWithAuctionType[]
    export let label: string

    let container: HTMLElement
    let checkbox: HTMLInputElement

    let activeSort = writable(null as ActiveSort | null)
    let dataSorted = data

    // Collapse on data change (ie user changed grouping criteria)
    $: {
        if (data && checkbox?.checked) {
            checkbox.click()
        }
    }

    // Sort data
    $: {
        let accessor: EquipAccessor<string> | EquipAccessor<number>
        const desc = $activeSort === null || $activeSort.type === 'desc'

        switch ($activeSort?.col) {
            // numbers
            case 'level':
                accessor = (eq) => eq.level
                dataSorted = sort(data, accessor, desc)
                break
            case 'date':
                accessor = (eq) => eq.auction.end_time ?? eq.auction.start_time
                dataSorted = sort(data, accessor, desc)
                break

            // strings
            case 'auction':
                accessor = (eq) => humanizeAuction(eq.auction)
                dataSorted = alphabetical(data, accessor, $activeSort.type)
                break
            case 'buyer':
                accessor = (eq) => eq.buyer
                dataSorted = alphabetical(data, accessor, $activeSort.type)
                break
            case 'seller':
                accessor = (eq) => eq.seller
                dataSorted = alphabetical(data, accessor, $activeSort.type)
                break
            case 'id':
                accessor = (eq) => eq.key
                dataSorted = alphabetical(data, accessor, $activeSort.type)
                break

            default:
                accessor = (eq) => eq.price
                dataSorted = sort(data, accessor, desc)
                break
        }
    }

    function humanizePrice(val: number, precision = 1): string {
        if (isNaN(val)) {
            return '0c'
        }

        let [factor, unit] = [1, '']

        if (val >= 1000 ** 2) {
            factor = 1000 ** 2
            unit = 'm'
        } else if (val >= 1000 ** 1) {
            factor = 1000 ** 1
            unit = 'k'
        } else {
            factor = 1
            unit = 'c'
        }

        let afterDiv = (val / factor).toFixed(precision)

        // Only show trailing zeros if price is in the mils
        //   eg "26.0m" is okay but "26.0k" is ugly
        if (afterDiv.endsWith('.0') && unit != 'm') {
            afterDiv = afterDiv.replace('.0', '')
        }

        return `${afterDiv}${unit}`
    }

    function humanizeDate(t: number) {
        const date = getDate(t * 1000)
        if (!date) {
            return ''
        }

        const year = date.getFullYear().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    function humanizeAuction(auction: EquipWithAuctionType['auction']): string {
        let numberRaw = auction.title_short ?? auction.title
        let number = parseInt(numberRaw)
        let numberString = isNaN(number) ? '???' : number.toString().padStart(3, '0')

        return `${auction.type}${numberString}`
    }

    function getThreadLink(id_auction: string): string {
        return `https://forums.e-hentai.org/index.php?showtopic=${id_auction}`
    }

    function getEquipLink(equip: EquipWithAuctionType): string {
        return `https://hentaiverse.org/equip/${equip.eid}/${equip.key}`
    }

    function handleToggle() {
        if (!checkbox.checked) {
            return
        }

        // Wait for expansion to complete
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    function handleSortChange(col: Column) {
        // If different column, start with desc
        if ($activeSort?.col !== col) {
            $activeSort = { col, type: 'desc' }
            return
        }

        // Else same column, so cycle between sort types
        switch ($activeSort?.type) {
            case 'desc':
                $activeSort = { col, type: 'asc' }
                return
            case 'asc':
                $activeSort = null
                return
        }
    }

    function getHeaderProps(col: Column, $activeSort: ActiveSort | null) {
        return {
            state: $activeSort?.col === col ? $activeSort.type : null
        }
    }
</script>

<div bind:this={container} class="my-container pt-4 w-full">
    <div class="collapse collapse-plus bg-base-200">
        <input bind:this={checkbox} type="checkbox" name="name" on:change={handleToggle} />

        <h1 class="collapse-title flex gap-3">
            <span class="min-w-11 text-right">[{data.length}]</span>
            <span>{label}</span>
        </h1>

        <div class="collapse-content min-w-0">
            <div class="overflow-auto max-h-[80vh] h-full">
                <table class="table table-zebra table-sm md:table-md table-pin-rows table-pin-cols">
                    <thead>
                        <tr class="bg-base-200">
                            <!-- Only the price header should be stickied, so it should be the only <th> -->
                            <SortHeader
                                tag="th"
                                classes="text-end bg-inherit"
                                {...getHeaderProps('price', $activeSort)}
                                on:click={() => handleSortChange('price')}
                            >
                                Price
                            </SortHeader>

                            <SortHeader
                                tag="td"
                                {...getHeaderProps('level', $activeSort)}
                                on:click={() => handleSortChange('level')}
                            >
                                Level
                            </SortHeader>

                            <td>Stats</td>

                            <td>Link</td>

                            <SortHeader
                                tag="td"
                                {...getHeaderProps('date', $activeSort)}
                                on:click={() => handleSortChange('date')}
                            >
                                Date
                            </SortHeader>

                            <SortHeader
                                tag="td"
                                {...getHeaderProps('auction', $activeSort)}
                                on:click={() => handleSortChange('auction')}
                            >
                                Auction
                            </SortHeader>

                            <SortHeader
                                tag="td"
                                {...getHeaderProps('buyer', $activeSort)}
                                on:click={() => handleSortChange('buyer')}
                            >
                                Buyer
                            </SortHeader>

                            <SortHeader
                                tag="td"
                                {...getHeaderProps('seller', $activeSort)}
                                on:click={() => handleSortChange('seller')}
                            >
                                Seller
                            </SortHeader>

                            <SortHeader
                                tag="td"
                                {...getHeaderProps('id', $activeSort)}
                                on:click={() => handleSortChange('id')}
                            >
                                ID
                            </SortHeader>

                            <td class="w-full"></td>
                        </tr>
                    </thead>

                    <tbody>
                        {#each dataSorted as eq}
                            <tr>
                                <th class="text-end w-full">
                                    {#if eq.bid_link}
                                        <a class="link" href={eq.bid_link ?? ''}>
                                            {humanizePrice(eq.price)}
                                        </a>
                                    {:else if eq.price > 0}
                                        {humanizePrice(eq.price)}
                                    {:else}
                                        ({humanizePrice(eq.next_bid)})
                                    {/if}
                                </th>

                                <td class="min-w-content whitespace-pre">{eq.stats.join('\n')}</td>

                                <td>{eq.level}</td>

                                <td>
                                    <a class="link" href={getEquipLink(eq)} target="_blank">
                                        Link
                                    </a>
                                </td>

                                <td class="whitespace-pre">
                                    {humanizeDate(eq.auction.end_time ?? eq.auction.start_time)}
                                </td>

                                <td>
                                    <a class="link" href={getThreadLink(eq.id_auction)}>
                                        {humanizeAuction(eq.auction)}
                                    </a>
                                </td>

                                <td class="whitespace-pre">{eq.buyer ?? '-'}</td>

                                <td class="whitespace-pre">{eq.seller}</td>

                                <td>{eq.key.slice(0, 4)}</td>

                                <td class="w-full"></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    /* Text will be offcenter unless the invisible input and its label have same text size */
    input,
    h1 {
        @apply min-h-0 text-sm md:text-base;
    }

    /* Alternate color of table rows */
    .table-zebra tbody {
        @apply bg-base-100;
    }
    thead > tr > * {
        @apply bg-base-200;
    }

    /* Fix missing link styling */
    .link {
        color: inherit;
    }

    /* Shorten animation so we can call scrollIntoView() earlier */
    .my-container :global(*) {
        transition-duration: 0.1s;
    }

    /* Reduce vertical padding */
    .my-container :global(td),
    .my-container :global(th) {
        @apply py-1;
    }

    /* Shrink table text */
    table :global(td) {
        @apply text-xs md:text-sm;
    }

    /* Hide accordion contents until expanded 
     * Otherwise page is super sluggish, especially when opening modals (which causes a reflow for some reason)
     */
    .collapse .collapse-content {
        display: none;
    }
    .collapse:has(:checked) .collapse-content {
        display: block;
    }

    /* Prevent row-headers from growing in width */
    .my-container :global(th) {
        width: max-content;
    }

    /* Fix the first column header having different font size 
     *(because first one is a <th> for the sticky functionality, others are <td>s) 
     */
    thead > tr > :global(*) {
        @apply text-sm;
    }
</style>
