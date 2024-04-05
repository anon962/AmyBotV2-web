<script lang="ts">
    import type { Equip } from './equip'

    export let data: Equip[]

    const name = data[0].name
</script>

<div class="collapse collapse-plus bg-base-200">
    <input type="checkbox" {name} />

    <h1 class="collapse-title flex gap-2">
        <span class="min-w-8">({data.length})</span>
        <span>{data[0].name}</span>
    </h1>

    <div class="collapse-content min-w-0">
        <div class="overflow-auto max-h-[90vh] h-full">
            <table class="table table-sm table-pin-rows">
                <thead>
                    <tr class="bg-base-200">
                        <td>Price</td>
                        <td>Stats</td>
                        <td>Level</td>
                        <td>Auction / Date</td>
                        <td>Buyer</td>
                        <td>Seller</td>
                    </tr>
                </thead>

                <tbody>
                    {#each data as eq}
                        <tr>
                            <td>{eq.price}</td>
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
        @apply min-h-0 text-sm;
    }
</style>
