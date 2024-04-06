export type FormInput = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export class FormControl {
    inputs: FormInput[] = []
    private subSink: Array<() => void> = []

    constructor(public onChange: (val: string) => void) {}

    setValue(val: string) {
        this.inputs.forEach((inp) => (inp.value = val))
    }

    register(inp: FormInput, initial: string) {
        inp.value = initial
        this.inputs.push(inp)

        const onChange = () => this._onChange(inp)

        inp.addEventListener('change', onChange)
        this.subSink.push(() => inp.removeEventListener('change', onChange))
    }

    _onChange(source: FormInput) {
        console.log('_onChange', source, source.value)
        this.inputs.filter((inp) => inp !== source).forEach((inp) => (inp.value = source.value))
        this.onChange(source.value)
    }

    destroy() {
        this.subSink.forEach((unsubscribe) => unsubscribe())
    }
}

export interface InputParser<T> {
    fromString: (x: string) => T
    toString: (x: T) => string
}

export type FormParsers<T> = { [K in keyof T]: InputParser<T[K]> }

export const StringParser = {
    fromString: (val: string) => val,
    toString: (val: string) => val
}
export const IntParser = {
    fromString: (val: string) => parseInt(val),
    toString: (val: number) => String(val)
}
export const BoolParser = {
    fromString: (val: string) => Boolean(val),
    toString: (val: boolean) => String(val)
}
