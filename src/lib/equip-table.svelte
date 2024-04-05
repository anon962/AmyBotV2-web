<script lang="ts">
    import { sort } from 'radash'
    import type { Equip } from './equip'

    export let data: Equip[]

    const dataSorted = sort(data, eq => eq.price, true)

    const name = data[0].name

    function humanizePrice(val: number, precision=1): string {
        let [factor, unit] = [1, '']

        if (val >= 1000 ** 2) {
            factor = 1000 ** 2
            unit = 'm'
        } else if (val >= 1000 ** 1) {
            factor = 1000 ** 1
            unit = 'k'
        } else {
            factor = 1
            unit = "c"
        }

        let afterDiv = (val / factor).toFixed(precision)

        // Only show trailing zeros if price is in the mils
        //   eg "26.0m" is okay but "26.0k" is ugly
        if (afterDiv.endsWith(".0") && unit != "m") {
            afterDiv = afterDiv.replace(".0", "")
        }

        return `${afterDiv}${unit}`
    }
</script>

<div class="collapse collapse-plus bg-base-200 max-w-[65rem]">
    <input type="checkbox" {name} />

    <h1 class="collapse-title flex gap-3">
        <span class="min-w-11 text-right">[{data.length}]</span>
        <span>{data[0].name}</span>
    </h1>

    <div class="collapse-content min-w-0">
        <div class="overflow-auto max-h-[80vh] h-full">
            <table class="table table-zebra table-sm md:table-md table-pin-rows">
                <thead>
                    <tr class="bg-base-200">
                        <td class="text-end max-w-content">Price</td>
                        <td>Stats</td>
                        <td>Level</td>
                        <td>Auction / Date</td>
                        <td>Buyer</td>
                        <td>Seller</td>
                    </tr>
                </thead>

                <tbody>
                    {#each dataSorted as eq}
                        <tr>
                            <td class="text-end max-w-content">{humanizePrice(eq.price)}</td>
                            <td class="min-w-content whitespace-pre">{eq.stats.join('\n')}</td>
                            <td>{eq.level}</td>
                            <td>{eq.auction.end_time}</td>
                            <td>{eq.buyer}</td>
                            <td>{eq.seller}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style lang="postcss">
    input,
    h1 {
        /* Text will be offcenter unless the invisible input and its label have same text size */
        @apply min-h-0 text-sm md:text-base;
    }

    .table-zebra tbody {
        @apply bg-neutral;

        & tr:nth-child(even) {
            @apply bg-base-100;
        }
    }
</style>
