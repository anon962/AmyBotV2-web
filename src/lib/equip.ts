import type { EquipSearchParams } from "./equip-search-context"

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
        id: string,
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