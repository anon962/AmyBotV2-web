import type { EquipSearchParams } from '$lib/equip-search-context'
import { getDate } from '$lib/utils'
import { getContext, setContext } from 'svelte'
import { get, writable, type Readable } from 'svelte/store'
import { BoolParser, FormControl, IntParser, StringParser, type FormParsers } from './form'

/**
 * This context does a few form-related things...
 *   - Multiple <form>s can be registered. Changes in one form are mirrored to other forms.
 *   - On user interaction (change events), <input> values (strings) are parsed and stored in the context.
 *   - <input> values can be programmatically modified
 *
 * There are a few constraints that can probably be removed if I wasn't lazy...
 *   - The shape of the parsed form data must be flat (no nested objects, no arrays)
 *   - The shape of the parsed form data cannot have optional keys ({ k?: v })
 *   - The parsing logic has to be manually supplied for each field. This context doesn't do any fancy type reflection.
 */

export interface EquipForm {
    name: string
    min_date_month: number
    min_date_year: number
    max_date_month: number
    max_date_year: number
    min_price: number
    max_price: number
    seller: string
    seller_is_partial: boolean
    buyer: string
    buyer_is_partial: boolean
}

export type EquipFormValue = {
    form: Readable<EquipForm>
    controls: EquipFormControls

    register: (input: HTMLInputElement, name: keyof EquipForm) => void
    destroy: () => void
}

export type EquipFormControls = Record<keyof EquipForm, FormControl>

const KEY = 'equip-form'

export function setEquipFormContext(initial: EquipSearchParams) {
    // Init controls for each form field
    const controls: EquipFormControls = Object.fromEntries(
        Object.keys(DEFAULT_EQUIP_FORM).map((key) => [
            key,
            new FormControl((update) => onChange(key as keyof EquipForm, update))
        ])
    ) as any

    // Load default values
    const defaultForm = mergeDefaultWithUrlParams(initial)
    const form = writable(defaultForm)

    // Create context
    const value = { form, controls, register, destroy }
    setContext<EquipFormValue>(KEY, value)

    return value

    function register(input: HTMLInputElement, name: keyof EquipForm) {
        const val = get(form)[name] as any
        const parser = EQUIP_FORM_PARSERS[name]
        // @ts-ignore
        const valString = parser.toString(val)

        controls[name].register(input, valString)
    }

    function onChange(key: keyof EquipForm, value: string) {
        const parser = EQUIP_FORM_PARSERS[key]

        form.update((current) => ({
            ...current,
            [key]: parser.fromString(value)
        }))
    }

    function destroy() {
        for (let c of Object.values(controls)) {
            c.destroy()
        }
    }
}

export function getEquipFormContext() {
    return getContext(KEY) as EquipFormValue
}

function mergeDefaultWithUrlParams(params: EquipSearchParams): EquipForm {
    const d = DEFAULT_EQUIP_FORM

    let min_date: Date | null = getDate(params.min_date)
    let max_date: Date | null = getDate(params.min_date)

    return {
        name: params.name?.join(' ') ?? d.name,
        min_date_month: min_date?.getMonth() ?? d.min_date_month,
        min_date_year: min_date?.getFullYear() ?? d.min_date_year,
        max_date_month: max_date?.getMonth() ?? d.max_date_month,
        max_date_year: max_date?.getFullYear() ?? d.max_date_year,
        min_price: params.min_price ?? d.min_price,
        max_price: params.max_price ?? d.max_price,
        seller: params.seller_partial ?? params.seller ?? d.seller,
        seller_is_partial: params.seller_partial !== undefined,
        buyer: params.buyer_partial ?? params.buyer ?? d.buyer,
        buyer_is_partial: params.buyer_partial !== undefined
    }
}

export const DEFAULT_EQUIP_FORM = {
    name: '',
    min_date_month: 0,
    min_date_year: 0,
    max_date_month: 11,
    max_date_year: 9999,
    min_price: 0,
    max_price: Infinity,
    seller: '',
    seller_is_partial: true,
    buyer: '',
    buyer_is_partial: true
}

export const EQUIP_FORM_PARSERS: FormParsers<EquipForm> = {
    name: StringParser,
    min_date_month: IntParser,
    min_date_year: IntParser,
    max_date_month: IntParser,
    max_date_year: IntParser,
    min_price: IntParser,
    max_price: IntParser,
    seller: StringParser,
    seller_is_partial: BoolParser,
    buyer: StringParser,
    buyer_is_partial: BoolParser
}
