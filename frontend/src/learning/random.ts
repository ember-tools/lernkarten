/** A seeded random source (mulberry32), so sessions and tests can repeat a draw. */
export function seededRandom(seed: number): () => number {
    let state = seed >>> 0
    return () => {
        state = (state + 0x6D2B79F5) >>> 0
        let mixed = state
        mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
        mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
    }
}

/** A shuffled copy of a list. */
export function shuffled<T>(items: readonly T[], random: () => number): T[] {
    const copy = [...items]
    for (let index = copy.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1))
        const kept = copy[index]!
        copy[index] = copy[other]!
        copy[other] = kept
    }
    return copy
}
