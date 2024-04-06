<script lang="ts">
    import { formToParams, setEquipFormContext } from './equip-form-context/context'
    import { getEquipSearchContext } from './equip-search-context'
    import FilterIcon from './icons/filter-icon.svelte'

    const { params, setParams } = getEquipSearchContext()
    const { form, register } = setEquipFormContext($params)

    function handleSubmit() {
        const update = formToParams($form)
        console.log('submitting', $form, update)
        setParams(update)
    }
</script>

<!-- @todo: add other filters inside dialog -->
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
            <button on:click|preventDefault type="button" class="btn btn-sm btn-ghost h-full">
                <FilterIcon />
            </button>
        </div>
    </label>
</form>

<style lang="postcss">
    input::placeholder {
        opacity: 0.6;
    }
</style>
