import { getDate } from '$lib/utils'
import { getContext, setContext } from 'svelte'
import { get, writable, type Readable } from 'svelte/store'
import type { EquipUrlParams } from '../url-context'
import {
    BoolParser,
    FormControl,
    IntParser,
    StringParser,
    type FormInput,
    type FormParsers
} from './form'

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

    register: (input: FormInput, name: keyof EquipForm) => void
    destroy: () => void
}

export type EquipFormControls = Record<keyof EquipForm, FormControl>

const KEY = 'equip-form'

export function setEquipFormContext(initial: EquipUrlParams) {
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

    function register(input: FormInput, name: keyof EquipForm) {
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

function mergeDefaultWithUrlParams(params: EquipUrlParams): EquipForm {
    const d = DEFAULT_EQUIP_FORM

    let min_date: Date | null = getDate(params.min_date)
    let min_date_month = min_date ? min_date.getMonth() + 1 : null

    let max_date: Date | null = getDate(params.min_date)
    let max_date_month = max_date ? max_date.getMonth() + 1 : null

    return {
        name: params.name?.join(' ') ?? d.name,
        min_date_month: min_date_month ?? d.min_date_month,
        min_date_year: min_date?.getFullYear() ?? d.min_date_year,
        max_date_month: min_date_month ?? d.max_date_month,
        max_date_year: max_date?.getFullYear() ?? d.max_date_year,
        min_price: params.min_price ?? d.min_price,
        max_price: params.max_price ?? d.max_price,
        seller: params.seller_partial ?? params.seller ?? d.seller,
        seller_is_partial: params.seller_partial !== undefined,
        buyer: params.buyer_partial ?? params.buyer ?? d.buyer,
        buyer_is_partial: params.buyer_partial !== undefined
    }
}

export function formToParams(form: EquipForm): EquipUrlParams {
    const params: EquipUrlParams = {}

    const d = DEFAULT_EQUIP_FORM

    if (form.name !== d.name) {
        params.name = form.name.split(' ')
    }

    // Form value for month is 1-indexed
    const min_month = form.min_date_month - 1
    const min_date = new Date(form.min_date_year, min_month, 1)

    const default_min_month = d.min_date_month - 1
    const default_min = new Date(d.min_date_year, default_min_month, 1)

    if (min_date.getTime() !== default_min.getTime()) {
        params.min_date = min_date.getTime()
    }

    // Month n + 1 with day 0 gets us the last day of month n
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
    const max_month = form.max_date_month - 1
    const max_date = new Date(form.max_date_year, max_month + 1, 0)

    const default_max_month = d.max_date_month - 1
    const default_max = new Date(d.max_date_year, default_max_month, 0)

    if (max_date.getTime() !== default_max.getTime()) {
        params.max_date = max_date.getTime()
    }

    if (form.min_price !== d.min_price) {
        params.min_price = form.min_price
    }

    if (form.max_price !== d.max_price) {
        params.max_price = form.max_price
    }

    if (form.seller !== d.seller) {
        const key = form.seller_is_partial ? 'seller_partial' : 'seller'
        params[key] = form.seller
    }

    if (form.buyer !== d.buyer) {
        const key = form.buyer_is_partial ? 'buyer_partial' : 'buyer'
        params[key] = form.buyer
    }

    return params
}

export const DEFAULT_EQUIP_FORM = {
    name: '',
    min_date_month: 1,
    min_date_year: 2016,
    max_date_month: 12,
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
