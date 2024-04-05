<script lang="ts">
    import type { Equip } from './equip'

    export let data: Equip[]

    const name = data[0].name
</script>

<div class="collapse collapse-plus bg-base-200">
    <input type="checkbox" {name} />

    <h2 class="collapse-title">{data[0].name}</h2>

    <div class="collapse-content overflow-auto min-h-0 h-full max-h-[66vh]">
        <table class="table table-sm table-pin-rows min-w-0">
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
                        <td>{eq.stats.join('\n')}</td>
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
