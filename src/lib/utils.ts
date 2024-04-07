import { isEqual } from 'radash'
import { type Readable, type Subscriber, type Unsubscriber } from 'svelte/store'

export function getDate(t?: number): Date | null {
    if (t === undefined || isNaN(t)) {
        return null
    }

    const d = new Date(t)
    if (isNaN(d.getTime())) {
        return null
    }

    return d
}

const UNINITIALIZED = Symbol('UNITIALIZED')

// Store that functions like dervied() but ignores duplicate emissions
export class DerivedUniqueStore<T> implements Readable<T> {
    private prevValue: T | typeof UNINITIALIZED = UNINITIALIZED

    constructor(private source: Readable<T>) {}

    subscribe(run: Subscriber<T>): Unsubscriber {
        this.prevValue = UNINITIALIZED

        return this.source.subscribe((update) => {
            if (this.prevValue === UNINITIALIZED || !isEqual(this.prevValue, update)) {
                this.prevValue = update
                run(update)
            }
        })
    }
}
