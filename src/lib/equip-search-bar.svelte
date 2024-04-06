<script lang="ts">
    import { formToParams, setEquipFormContext } from './equip-form-context/context'
    import { getEquipSearchContext } from './equip-search-context'

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
    <input
        use:register={'name'}
        class="input input-bordered input-primary w-full"
        name="name"
        type="text"
        placeholder="peerl heimd oak"
    />
</form>

<style lang="postcss">
    input::placeholder {
        opacity: 0.6;
    }
</style>
