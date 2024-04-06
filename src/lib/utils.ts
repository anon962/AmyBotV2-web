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
