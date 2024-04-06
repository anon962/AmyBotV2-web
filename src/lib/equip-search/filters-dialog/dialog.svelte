<script lang="ts">
    import { formToParams, getEquipFormContext } from '../form-context/context'
    import { getEquipUrlContext } from '../url-context'
    import MonthYearInput from './month-year-input.svelte'

    let closeButton: HTMLButtonElement
    let minDateMonthEl: HTMLInputElement
    let minDateYearEl: HTMLInputElement

    const { setParams } = getEquipUrlContext()
    const { form, controls, register } = getEquipFormContext()

    function handleSubmit() {
        closeButton.click()

        const update = formToParams($form)
        setParams(update)
    }
</script>

<div class="container modal-box">
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
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

        <!-- Date -->
        <MonthYearInput />

        <!-- Price -->

        <!-- Buyer -->

        <!-- Seller -->

        <button>Submit</button>
    </form>
</div>

<form method="dialog" class="modal-backdrop">
    <button bind:this={closeButton}>close</button>
</form>

<style lang="postcss">
    .container {
        & :global(.input-container) {
            @apply flex flex-col gap-2;
        }

        & :global(.input-label) {
            opacity: 0.65;
            font-weight: bold;
        }
    }
</style>
