<script lang="ts">
    import { sort } from 'radash'
    import type { EquipWithAuctionType } from './equip'
    import { getDate } from './utils'

    export let data: EquipWithAuctionType[]

    let container: HTMLElement
    let checkbox: HTMLInputElement

    const dataSorted = sort(data, (eq) => eq.price, true)

    const name = data[0].name

    function humanizePrice(val: number, precision = 1): string {
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

    function handleToggle(ev: Event) {
        if (!checkbox.checked) {
            return
        }

        // Wait for expansion to complete
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }
</script>

<!-- @todo: rows should be sortable -->
<div bind:this={container} class="container pt-4 w-full">
    <div class="collapse collapse-plus bg-base-200">
        <input bind:this={checkbox} type="checkbox" {name} on:change={handleToggle} />

        <h1 class="collapse-title flex gap-3">
            <span class="min-w-11 text-right">[{data.length}]</span>
            <span>{data[0].name}</span>
        </h1>

        <div class="collapse-content min-w-0">
            <div class="overflow-auto max-h-[80vh] h-full">
                <table class="table table-zebra table-sm md:table-md table-pin-rows table-pin-cols">
                    <thead>
                        <tr class="bg-base-200">
                            <!-- Only the price header should be stickied, so it should be the only <th> -->
                            <th class="text-end max-w-content bg-inherit">Price</th>
                            <td>Stats</td>
                            <td>Level</td>
                            <td>Auction</td>
                            <td>Date</td>
                            <td>Buyer</td>
                            <td>Seller</td>
                            <td>Link</td>
                        </tr>
                    </thead>

                    <tbody>
                        {#each dataSorted as eq}
                            <tr>
                                <th class="text-end max-w-content">
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
                                    <a class="link" href={getThreadLink(eq.id_auction)}>
                                        {humanizeAuction(eq.auction)}
                                    </a>
                                </td>
                                <td>
                                    {humanizeDate(eq.auction.end_time ?? eq.auction.start_time)}
                                </td>
                                <td>{eq.buyer ?? '-'}</td>
                                <td>{eq.seller}</td>
                                <td>
                                    <a class="link" href={getEquipLink(eq)} target="_blank">
                                        Link
                                    </a>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    input,
    h1 {
        /* Text will be offcenter unless the invisible input and its label have same text size */
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
    .container :global(*) {
        transition-duration: 0.1s;
    }

    /* Reduce vertical padding */
    td {
        @apply py-2;
    }
</style>
