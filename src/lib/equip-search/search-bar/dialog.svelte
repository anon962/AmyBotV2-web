<script lang="ts">
    import XIcon from '$lib/icons/x-icon.svelte'
    import { onDestroy, onMount } from 'svelte'
    import { DEFAULT_EQUIP_FORM, formToParams, getEquipFormContext } from '../form-context/context'
    import { getEquipUrlContext } from '../url-context'
    import MonthYearInput from './month-year-input.svelte'
    import PriceInput from './price-input.svelte'

    export let dialogEl: HTMLDialogElement

    let closeButton: HTMLButtonElement

    const { setParams } = getEquipUrlContext()
    const { form, formInitial, register, setValue } = getEquipFormContext()

    function closeDialog() {
        // Pop the hash we added to history
        window.history.back()

        // Close dialog
        dialogEl.close()
    }

    function resetAndClose() {
        setValue($formInitial)
        closeDialog()
    }

    function handleSubmit() {
        const update = formToParams($form)

        closeDialog()

        // @jank: Navigating immediately after a history.back() doesn't work for some reason
        setTimeout(() => {
            setParams(update)
        }, 50)
    }

    function handleClear() {
        setValue(DEFAULT_EQUIP_FORM)
    }

    function handleReset() {
        setValue($formInitial)
    }

    function handleNameClear() {
        setValue({ ...$form, name: '' })
    }

    // Parent component sets appends hash to url on dialog open
    // This lets us detect when the back button is pressed (which clears the hash)
    // Here we poll for that change and close the dialog when it happens
    let urlSubId: number = 0
    onMount(() => {
        urlSubId = setInterval(() => {
            if (!window.location.hash) {
                dialogEl.close()
            }
        })
    })
    onDestroy(() => {
        clearInterval(urlSubId)
    })
</script>

<div class="my-container modal-box p-0 h-max max-h-[80vh] max-w-[80vw] md:max-w-[50rem]">
    <form on:submit|preventDefault={handleSubmit} class="h-max max-h-[80vh] flex flex-col">
        <!-- Form inputs -->
        <div class="min-h-0 py-4 px-6 overflow-auto flex flex-col">
            <!-- Equip name -->
            <div class="input-container">
                <label for="name" class="input-label">Equip Name</label>

                <label class="w-full px-0 input input-bordered flex gap-2 items-center">
                    <input
                        use:register={'name'}
                        class="pl-4 grow"
                        name="name"
                        type="text"
                        placeholder="peerl heimd oak"
                    />

                    {#if $form.name}
                        <div class="pr-4 h-full flex items-center">
                            <button
                                on:click|preventDefault={handleNameClear}
                                type="button"
                                class="btn btn-sm btn-ghost btn-circle"
                            >
                                <XIcon />
                            </button>
                        </div>
                    {/if}
                </label>
            </div>

            <div class="divider"></div>

            <!-- Date -->
            <div class="two-col-grid">
                <MonthYearInput variant="min" autofocus={true} />
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
            <!-- @todo generic text input with clear button, maybe support the equip name usecase if possible -->
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
        </div>

        <!-- Action buttons -->
        <footer class="p-4 border-t-2 border-base-300 flex justify-between gap-2 xs:gap-4">
            <button on:click={() => handleReset()} type="button" class="btn btn-outline">
                Reset
            </button>

            <button on:click={() => handleClear()} type="button" class="btn btn-outline">
                Clear
            </button>

            <span class="flex-grow hidden xs:block"></span>

            <button class="btn btn-primary">Submit</button>
        </footer>
    </form>
</div>

<!-- Click backdrop can also close dialog -->
<form method="dialog" class="modal-backdrop">
    <button bind:this={closeButton} on:click={resetAndClose}>close</button>
</form>

<style lang="postcss">
    .my-container :global(.input-container) {
        @apply flex flex-col gap-1;
    }

    .my-container :global(.input-label) {
        opacity: 0.65;
        font-weight: bold;
    }

    .divider {
        @apply py-3;
    }

    .two-col-grid {
        @apply grid grid-rows-2 gap-4 xs:grid-rows-1 xs:grid-cols-2 xs:gap-4 md:gap-12;
    }

    footer .btn {
        min-width: 4rem;
        max-width: 8rem;
        flex-grow: 1;

        height: 2.5rem;
        min-height: 0;
    }
</style>
