type CacheValue = {
  value: string
  expiresAt?: number
}

type CacheManager = {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, ttlSeconds?: number) => Promise<void>
  del: (key: string) => Promise<void>
}

const GLOBAL_KEY = "__integratewise_cache__"

function getStore(): Map<string, CacheValue> {
  const g = globalThis as unknown as Record<string, any>
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new Map<string, CacheValue>()
  return g[GLOBAL_KEY]
}

export function getCacheManager(): CacheManager {
  const store = getStore()

  return {
    async get(key: string) {
      const entry = store.get(key)
      if (!entry) return null
      if (entry.expiresAt && entry.expiresAt <= Date.now()) {
        store.delete(key)
        return null
      }
      return entry.value
    },
    async set(key: string, value: string, ttlSeconds?: number) {
      const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
      store.set(key, { value, expiresAt })
    },
    async del(key: string) {
      store.delete(key)
    },
  }
}
