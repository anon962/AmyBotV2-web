<script lang="ts">
    import FilterIcon from '$lib/icons/filter-icon.svelte'
    import EquipSearchDialog from './filters-dialog/dialog.svelte'
    import { formToParams, setEquipFormContext } from './form-context/context'
    import { getEquipUrlContext } from './url-context'

    let dialogEl: HTMLDialogElement

    const { params, setParams } = getEquipUrlContext()
    const { form, register } = setEquipFormContext($params)

    function handleSubmit() {
        const update = formToParams($form)
        setParams(update)
    }

    function handleDialogOpen() {
        dialogEl.showModal()

        // Add history entry with hash so we can detect when back button is pressed and close the dialog
        window.location.hash = ''
        window.history.pushState({}, '', `#hash-for-mobile-back-button`)
    }

    function handleDialogClose() {
        // If user didn't exit with back button, the history entry we added (marked by the hash) needs to be removed
        if (window.location.hash) {
            window.history.back()
        }
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
                <FilterIcon />
            </button>
        </div>
    </label>
</form>

<dialog bind:this={dialogEl} on:close={handleDialogClose} class="modal">
    <EquipSearchDialog {dialogEl} />
</dialog>
