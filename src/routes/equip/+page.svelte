<script lang="ts">
    import { getEquipSearchContext, setEquipSearchContext } from '$lib/equip-search-context'
    import { createQuery } from '@tanstack/svelte-query'

    setEquipSearchContext()
    const { params, isEmpty, raw, setParams } = getEquipSearchContext()

    const query = createQuery({
        queryKey: [$raw.toString()],
        queryFn: async () => {
            if ($isEmpty) {
                return []
            }

            const url = new URL(import.meta.env.VITE_API_URL)
            url.pathname = "super/search_equips"
            url.search = $raw.toString()

            const resp = await fetch(url)
            const data = await resp.json()
            return data
        }
    })
</script>

<pre>
    {JSON.stringify($params)}

    {#if $query.isSuccess}
        <pre>
            {JSON.stringify($query.data)}
        </pre>
    {/if}
</pre>
