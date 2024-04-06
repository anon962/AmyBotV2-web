export interface Equip {
    id: string
    id_auction: string
    name: string
    eid: number
    key: string
    is_isekai: 0 | 1
    level: number
    stats: string[]
    price: number
    bid_link?: string
    next_bid: number
    buyer: string
    seller: string
    auction: {
        id: string
        end_time: number
        is_complete: 0 | 1
        title: string

        // @jank: API response from kedama auctions are slightly different, please fix
        title_short?: string
        start_time?: number
    }
}

type AuctionWithType = Equip['auction'] & { type: string }
export type EquipWithAuctionType = Equip & { auction: AuctionWithType }

export async function fetchEquips(search: URLSearchParams) {
    let data: EquipWithAuctionType[] = []

    const super_url = new URL(import.meta.env.VITE_API_URL)
    super_url.pathname = 'super/search_equips'
    super_url.search = search.toString()

    const s_resp = await fetch(super_url)
    const s_data = (await s_resp.json()) as Equip[]
    s_data.forEach((eq) =>
        data.push({
            ...eq,
            auction: { ...eq.auction, type: 'S' }
        })
    )

    const kedama_url = new URL(import.meta.env.VITE_API_URL)
    kedama_url.pathname = 'kedama/search_equips'
    kedama_url.search = search.toString()

    const k_resp = await fetch(kedama_url)
    const k_data = (await k_resp.json()) as Equip[]
    k_data.forEach((eq) =>
        data.push({
            ...eq,
            auction: { ...eq.auction, type: 'K' }
        })
    )

    return data
}
