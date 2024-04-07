<script lang="ts">
    import { formToParams, getEquipFormContext } from '../form-context/context'
    import { getEquipUrlContext } from '../url-context'
    import MonthYearInput from './month-year-input.svelte'
    import PriceInput from './price-input.svelte'

    let closeButton: HTMLButtonElement

    const { setParams } = getEquipUrlContext()
    const { form, register } = getEquipFormContext()

    function handleSubmit() {
        closeButton.click()

        const update = formToParams($form)
        setParams(update)
    }
</script>

<div class="container modal-box">
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col">
        <!-- Equip name -->
        <div class="input-container">
            <label for="name" class="input-label">Equip Name</label>

            <input
                use:register={'name'}
                class="grow input input-bordered"
                name="name"
                type="text"
                placeholder="peerl heimd oak"
            />
        </div>

        <div class="divider"></div>

        <!-- Date -->
        <div class="two-col-grid">
            <MonthYearInput variant="min" />
            <MonthYearInput variant="max" />
        </div>

        <div class="divider"></div>

        <!-- Price -->
        <div class="two-col-grid">
            <PriceInput variant="min" />
            <PriceInput variant="max" />
        </div>

        <div class="divider"></div>

        <!-- User -->
        <div class="two-col-grid">
            <div class="input-container">
                <label for="buyer" class="input-label">Buyer</label>
                <input
                    use:register={'buyer'}
                    name="buyer"
                    type="text"
                    placeholder="프레이"
                    class="input input-bordered grow min-w-0"
                />
            </div>

            <div class="input-container">
                <label for="seller" class="input-label">Seller</label>
                <input
                    use:register={'seller'}
                    name="seller"
                    type="text"
                    placeholder="tenboro"
                    class="input input-bordered grow min-w-0"
                />
            </div>
        </div>

        <div class="divider"></div>

        <button class="btn btn-primary">Submit</button>
    </form>
</div>

<form method="dialog" class="modal-backdrop">
    <button bind:this={closeButton}>close</button>
</form>

<style lang="postcss">
    .container :global(.input-container) {
        @apply flex flex-col gap-2;
    }

    .container :global(.input-label) {
        opacity: 0.65;
        font-weight: bold;
    }

    .divider {
        @apply py-4;
    }

    .two-col-grid {
        @apply grid grid-rows-2 gap-4 xs:grid-rows-1 xs:grid-cols-2 xs:gap-12;
    }
</style>
