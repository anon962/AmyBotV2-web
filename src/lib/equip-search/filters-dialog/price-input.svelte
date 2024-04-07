<script lang="ts">
    import { derived, writable, type Writable } from 'svelte/store'
    import { getEquipFormContext } from '../form-context/context'

    export let variant: 'min' | 'max'

    let priceInputEl: HTMLInputElement
    let unitInputEl: HTMLInputElement

    const label = variant === 'min' ? 'Min Price' : 'Max Price'
    const controlName = variant === 'min' ? 'min_price' : 'max_price'

    const { form, controls } = getEquipFormContext()

    let unit: Writable<'m' | 'k' | 'c'> = writable('m')
    const unitValue = derived(unit, ($mult) => {
        switch ($mult) {
            case 'm':
                return 1000 ** 2
            case 'k':
                return 1000 ** 1
            case 'c':
                return 1000 ** 0
        }
    })

    const value = derived([form, unitValue], ([$form, $multValue]) => {
        const current = $form[controlName]
        return Math.floor(current / $multValue)
    })

    function handlePriceChange() {
        const update = parseInt(priceInputEl.value) * $unitValue
        controls[controlName].publishValue(update.toString())
    }

    function handleUnitChange() {
        $unit = unitInputEl.value as any
    }
</script>

<div class="input-container">
    <label for="min_price" class="input-label">{label}</label>

    <div class="flex gap-2">
        <input
            bind:this={priceInputEl}
            on:change={handlePriceChange}
            class="input input-bordered grow min-w-0 max-w-[8rem]"
            name="min_price"
            type="number"
            value={$value}
        />

        <select
            on:change={handleUnitChange}
            class="select select-bordered w-full max-w-[4rem] pr-1 pl-4"
            value={$unit}
        >
            <option value="m">m</option>
            <option value="k">k</option>
            <option value="c">c</option>
        </select>
    </div>
</div>

<style lang="postcss">
    input,
    select {
        min-height: 0;
        height: 2.5rem;
    }
</style>
