import redis from 'App/Services/Redis'

export default class RedisRepository {
  /* public async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key)

    if (!value) {
      return null
    }

    return JSON.parse(value) as T
  } */
  public async get<T>(key: string): Promise<T | null> {
    try {
      console.log("Redis GET started")
      const value = await redis.get(key)
      console.log("Redis value:", value)

      if (!value) {
        return null
      }

      return JSON.parse(value) as T
    } catch (error) {
      console.error("❌ Redis GET Error:", error)
      return null
    }
  }

  public async set(
    key: string,
    value: unknown,
    ttl = 300
  ): Promise<void> {
    try {
      console.log("SET Key:", key)
      console.log("SET Value:", value)

      const result = await redis.set(
        key,
        JSON.stringify(value),
        "EX",
        ttl
      )

      console.log("Redis SET Result:", result)
    } catch (error) {
      console.error("❌ Redis SET Error:", error)
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error("❌ Redis DELETE Error:", error)
    }
  }
}
