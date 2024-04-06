import { fetchEquips } from '$lib/equip'
import { readUrlParams, setUrlParams } from '$lib/equip-search-context'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
    const equipParams = readUrlParams(url.searchParams)
    const queryParams = setUrlParams(equipParams, new URLSearchParams())
    const queryString = queryParams.toString()

    const data = queryString.length ? await fetchEquips(queryString) : []

    return {
        initQueryString: queryString,
        initEquips: data
    }
}
