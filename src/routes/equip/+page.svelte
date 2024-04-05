<script lang="ts">
    import { getEquipSearchContext, setEquipSearchContext } from '$lib/equip-search-context'

    setEquipSearchContext()
    const { params, setParams } = getEquipSearchContext()
</script>

<pre>
    {JSON.stringify($params)}
</pre>
