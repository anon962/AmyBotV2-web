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

        const onChange = () => this.publishValue(inp.value, inp)

        inp.addEventListener('change', onChange)
        this.subSink.push(() => inp.removeEventListener('change', onChange))
    }

    publishValue(val: string, ignore?: FormInput) {
        this.inputs.filter((inp) => inp !== ignore).forEach((inp) => (inp.value = val))
        this.onChange(val)
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
