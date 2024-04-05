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
    bid_link: string
    next_bid: number
    buyer: string
    seller: string
    auction: {
        id: string,
        end_time: number
        is_complete: 0 | 1
        title: string
    }
}