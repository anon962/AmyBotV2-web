<script lang="ts">
    import FilterIcon from '$lib/icons/filter-icon.svelte'
    import EquipSearchDialog from './filters-dialog/dialog.svelte'
    import { formToParams, setEquipFormContext } from './form-context/context'
    import { getEquipUrlContext } from './url-context'

    let dialog: HTMLDialogElement

    const { params, setParams } = getEquipUrlContext()
    const { form, register } = setEquipFormContext($params)

    function handleSubmit() {
        const update = formToParams($form)
        setParams(update)
    }
</script>

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
                on:click|preventDefault={() => dialog.showModal()}
                type="button"
                class="btn btn-sm btn-ghost h-full"
            >
                <FilterIcon />
            </button>
        </div>
    </label>
</form>

<dialog bind:this={dialog} class="modal">
    <EquipSearchDialog />
</dialog>

<style lang="postcss">
    input::placeholder {
        opacity: 0.6;
    }
</style>
