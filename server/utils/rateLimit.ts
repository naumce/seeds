const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

/** Fixed-window, in-memory limiter — enough for a single-instance MVP. */
export const checkRateLimit = (key: string, now = Date.now()): boolean => {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    return false
  }
  hits.set(key, [...recent, now])
  return true
}
