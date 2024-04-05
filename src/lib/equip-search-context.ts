import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { getContext, setContext } from 'svelte'
import { derived, get, type Readable } from 'svelte/store'

export interface EquipSearchParams {
    name?: string[]
    min_date?: number
    max_date?: number
    min_price?: number
    max_price?: number
    seller?: string
    seller_partial?: string
    buyer?: string
    buyer_partial?: string
}

export type EquipSearchValue = {
    params: Readable<Readonly<EquipSearchParams>>,
    setParams: (params: EquipSearchParams) => void
}

const KEY = 'equip-search'

export function setEquipSearchContext() {
    let params = derived(page, (pg) => readUrlParams(pg.url.searchParams))
    let value = { params, setParams }
    setContext<EquipSearchValue>(KEY, value)

    function setParams(params: EquipSearchParams) {
        const update = new URL(get(page).url.href)
        setUrlParams(params, update.searchParams)
        goto(update.href)
    }
}

export function getEquipSearchContext() {
    return getContext(KEY) as EquipSearchValue
}


function readUrlParams(url: URLSearchParams): EquipSearchParams {
    let params = {} as EquipSearchParams

    let val: string | null = null;

    val = url.get("name")
    if(val) {
        params.name = val.split(",")
    }

    val = url.get("min_date")
    if(val) {
        let parsed = parseInt(val)
        if (!isNaN(parsed)) {
            params.min_date = parsed
        }
    }

    val = url.get("max_price")
    if(val) {
        let parsed = parseInt(val)
        if (!isNaN(parsed)) {
            params.max_price = parsed
        }
    }


    val = url.get("min_price")
    if(val) {
        let parsed = parseInt(val)
        if (!isNaN(parsed)) {
            params.min_price = parsed
        }
    }


    val = url.get("max_price")
    if(val) {
        let parsed = parseInt(val)
        if (!isNaN(parsed)) {
            params.max_price = parsed
        }
    }

    val = url.get("seller")
    if(val) {
        params.seller = val
    }

    val = url.get("seller_partial")
    if(val) {
        params.seller_partial = val
    }

    val = url.get("buyer")
    if(val) {
        params.buyer = val
    }

    val = url.get("buyer_partial")
    if(val) {
        params.buyer_partial = val
    }

    return params
}

function setUrlParams(params: EquipSearchParams, url: URLSearchParams): URLSearchParams {
    if (params.name) {
        url.set("name", params.name.join(","))
    }

    if (params.min_date) {
        url.set("min_date", params.min_date.toString())
    }

    if (params.max_date) {
        url.set("max_date", params.max_date.toString())
    }

    if (params.min_price) {
        url.set("min_price", params.min_price.toString())
    }

    if (params.max_price) {
        url.set("max_price", params.max_price.toString())
    }

    if (params.seller) {
        url.set("seller", params.seller.toString())
    }

    if (params.seller_partial) {
        url.set("seller_partial", params.seller_partial.toString())
    }

    if (params.buyer) {
        url.set("buyer", params.buyer.toString())
    }

    if (params.buyer_partial) {
        url.set("buyer_partial", params.buyer_partial.toString())
    }

    return url
}