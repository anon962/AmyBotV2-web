<script lang="ts">
    import { pushState } from '$app/navigation'
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
    const { form, register } = setEquipFormContext(params)

    function handleSubmit() {
        const update = formToParams($form)
        setParams(update)
    }

    function handleDialogOpen() {
        dialogEl.showModal()

        // Add history entry with hash so we can detect when back button is pressed and close the dialog
        pushState('#hash-for-back-button', {})
    }

    // Compare current form value with default but exclude certain props
    function formHasChanges(current: EquipForm): boolean {
        return !isEqual({ ...current, name: undefined }, { ...DEFAULT_EQUIP_FORM, name: undefined })
    }
</script>

<!-- @todo: group options (item name, user) with default based on search params -->
<form class="w-full max-w-[50rem]" on:submit|preventDefault={handleSubmit}>
    <label class="w-full px-0 input input-bordered input-primary flex gap-2 items-center">
        <input
            use:register={'name'}
            class="pl-4 grow"
            name="name"
            type="text"
            placeholder="peerl heimd oak"
        />

        <div class="p-1 h-full">
            <button
                on:click|preventDefault={handleDialogOpen}
                type="button"
                class="btn btn-sm btn-ghost h-full"
            >
                <DialogIcon active={formHasChanges($form)} />
            </button>
        </div>
    </label>
</form>

<dialog bind:this={dialogEl} class="modal">
    <EquipSearchDialog {dialogEl} />
</dialog>
