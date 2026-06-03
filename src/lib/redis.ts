import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export async function getRedisValue<T>(key: string): Promise<T | null> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    return await redis.get(key)
  } catch {
    return null
  }
}

export async function setRedisValue(key: string, value: string, ex?: number): Promise<void> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return
    if (ex) {
      await redis.setex(key, ex, value)
    } else {
      await redis.set(key, value)
    }
  } catch {
    // Silently fail
  }
}
