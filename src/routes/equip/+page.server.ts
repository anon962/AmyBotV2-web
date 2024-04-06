import { fetchEquips } from '$lib/equip-search/equip'
import { readRawUrlParams, setRawUrlParams } from '$lib/equip-search/url-context'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
    const equipParams = readRawUrlParams(url.searchParams)
    const queryParams = setRawUrlParams(equipParams, new URLSearchParams())
    const queryString = queryParams.toString()

    const data = queryString.length ? await fetchEquips(queryString) : []

    return {
        initQueryString: queryString,
        initEquips: data
    }
}
