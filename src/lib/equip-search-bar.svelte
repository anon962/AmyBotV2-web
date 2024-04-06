<script lang="ts">
    import { onMount } from 'svelte'
    import { setEquipFormContext } from './equip-form-context/context'
    import { getEquipSearchContext } from './equip-search-context'

    const { params } = getEquipSearchContext()
    const { register, form } = setEquipFormContext($params)

    onMount(() => {})
</script>

<!-- @todo: load initial value from url -->
<!-- @todo: add other filters inside dialog -->
<input
    use:register={'name'}
    class="input input-bordered w-full max-w-xs"
    name="name"
    type="text"
    placeholder="peerl heimd oak"
/>
