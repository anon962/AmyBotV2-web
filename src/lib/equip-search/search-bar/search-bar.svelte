<script lang="ts">
    import { pushState } from '$app/navigation'
    import XIcon from '$lib/icons/x-icon.svelte'
    import { isEqual } from 'radash'
    import {
        DEFAULT_EQUIP_FORM,
        formToParams,
        setEquipFormContext,
        type EquipForm
    } from '../form-context/context'
    import { getEquipUrlContext } from '../url-context'
    import DialogIcon from './dialog-icon.svelte'
    import EquipSearchDialog from './dialog.svelte'

    let dialogEl: HTMLDialogElement

    const { params, setParams } = getEquipUrlContext()
    const { form, setValue, register } = setEquipFormContext(params)

    function handleSubmit() {
        const update = formToParams($form)
        setParams(update)
    }

    function handleDialogOpen() {
        dialogEl.showModal()

        // Add history entry with hash so we can detect when back button is pressed and close the dialog
        pushState('#hash-for-back-button', {})
    }

    function handleClear() {
        setValue({ ...$form, name: '' })
    }

    // Compare current form value with default but exclude certain props
    function formHasChanges(current: EquipForm): boolean {
        return !isEqual({ ...current, name: undefined }, { ...DEFAULT_EQUIP_FORM, name: undefined })
    }
</script>

<!-- @todo consider showing suggestions oninput, eg "st" suggests "... staff ..." -->
<form class="w-full max-w-[50rem]" on:submit|preventDefault={handleSubmit}>
    <label class="w-full px-0 input input-bordered input-primary flex gap-2 items-center">
        <input
            use:register={'name'}
            class="pl-4 grow min-w-0"
            name="name"
            type="text"
            placeholder="peerl heimd oak"
        />

        <div class="p-1 pr-3 h-full flex gap-1">
            {#if $form.name}
                <button
                    on:click|preventDefault={handleClear}
                    type="button"
                    class="btn btn-sm btn-ghost btn-circle my-auto"
                >
                    <XIcon />
                </button>
            {/if}

            <button
                on:click|preventDefault={handleDialogOpen}
                type="button"
                class="btn btn-sm btn-ghost btn-circle my-auto"
            >
                <DialogIcon active={formHasChanges($form)} />
            </button>
        </div>
    </label>
</form>

<dialog bind:this={dialogEl} class="modal">
    <EquipSearchDialog {dialogEl} />
</dialog>

<style lang="postcss">
    .btn {
        @apply w-7;
    }
</style>
