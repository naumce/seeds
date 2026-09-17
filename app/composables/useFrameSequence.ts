/**
 * Rolling-window loader for a numbered image sequence.
 *
 * Only a band of frames around the current index is kept decoded; frames
 * ahead in the scroll direction are prefetched first. Nothing is ever
 * preloaded in full — the guide's hard rule for the hero.
 */
export interface FrameSequenceOptions {
  count: number
  url: (index: number) => string
  /** Frames kept decoded on each side of the current index. */
  window?: number
  /** Frames decoded up-front before the hero is revealed. */
  initial?: number
  /** Max concurrent decodes. */
  concurrency?: number
}

export const useFrameSequence = (opts: FrameSequenceOptions) => {
  const windowSize = opts.window ?? 40
  const initial = opts.initial ?? 24
  const concurrency = opts.concurrency ?? 6

  const cache = new Map<number, HTMLImageElement>()
  const pending = new Set<number>()
  const queue: number[] = []
  let active = 0
  let direction = 1
  let lastIndex = 0
  let onDecoded: ((i: number) => void) | null = null

  const load = (i: number) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`frame ${i} failed`))
      img.src = opts.url(i)
    })

  const pump = () => {
    while (active < concurrency && queue.length) {
      const i = queue.shift() as number
      if (cache.has(i) || pending.has(i)) continue
      pending.add(i)
      active += 1
      load(i)
        .then((img) => {
          cache.set(i, img)
          onDecoded?.(i)
        })
        .catch(() => {
          /* a missing frame just falls back to the nearest decoded one */
        })
        .finally(() => {
          pending.delete(i)
          active -= 1
          pump()
        })
    }
  }

  const enqueue = (indices: number[]) => {
    const fresh = indices.filter((i) => i >= 0 && i < opts.count && !cache.has(i) && !pending.has(i))
    queue.push(...fresh)
    pump()
  }

  const evict = (center: number) => {
    const keep = windowSize * 2
    for (const i of Array.from(cache.keys())) {
      if (Math.abs(i - center) > keep && i > initial) cache.delete(i)
    }
  }

  /**
   * Decode the opening frames before the hero is revealed, reporting 0..1
   * progress. A missing frame or a very slow network never blocks the page:
   * the promise settles after `timeoutMs` regardless.
   */
  const prime = (onProgress?: (ratio: number) => void, timeoutMs = 6000) =>
    new Promise<void>((resolve) => {
      let settled = false
      let done = 0
      const finish = () => {
        if (settled) return
        settled = true
        resolve()
      }
      const tick = () => {
        done += 1
        onProgress?.(Math.min(1, done / initial))
        if (done >= initial) finish()
      }
      for (let i = 0; i < initial; i += 1) {
        load(i)
          .then((img) => cache.set(i, img))
          .catch(() => undefined)
          .finally(tick)
      }
      setTimeout(finish, timeoutMs)
    })

  /** Call on every scroll update; reprioritises the queue around `index`. */
  const seek = (index: number) => {
    const i = Math.max(0, Math.min(opts.count - 1, Math.round(index)))
    if (i !== lastIndex) direction = i > lastIndex ? 1 : -1
    lastIndex = i
    queue.length = 0
    const ahead = Array.from({ length: windowSize }, (_, k) => i + direction * (k + 1))
    const behind = Array.from({ length: Math.floor(windowSize / 2) }, (_, k) => i - direction * (k + 1))
    enqueue([i, ...ahead, ...behind])
    evict(i)
  }

  /** Nearest decoded frame at or below `index`, falling back upward. */
  const nearest = (index: number): HTMLImageElement | undefined => {
    const i = Math.max(0, Math.min(opts.count - 1, Math.round(index)))
    if (cache.has(i)) return cache.get(i)
    for (let d = 1; d < opts.count; d += 1) {
      if (cache.has(i - d)) return cache.get(i - d)
      if (cache.has(i + d)) return cache.get(i + d)
    }
    return undefined
  }

  const onFrame = (fn: (i: number) => void) => {
    onDecoded = fn
  }

  const dispose = () => {
    queue.length = 0
    cache.clear()
    onDecoded = null
  }

  return { prime, seek, nearest, onFrame, dispose }
}
