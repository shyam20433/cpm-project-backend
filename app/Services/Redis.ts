import Env from '@ioc:Adonis/Core/Env'
import Redis from 'ioredis'

const MAX_RETRIES = 10
const RETRY_DELAY_MS = 1000

const redis = new Redis({
  host: Env.get('REDIS_HOST'),
  port: Number(Env.get('REDIS_PORT')),
  password: Env.get('REDIS_PASSWORD') || undefined,
  retryStrategy(times) {
    if (times > MAX_RETRIES) {
      console.error(`❌ Redis: Could not connect after ${MAX_RETRIES} attempts. Giving up.`)
      return null
    }
    console.warn(`⚠️  Redis: Connection attempt ${times}/${MAX_RETRIES}, retrying in ${RETRY_DELAY_MS}ms...`)
    return RETRY_DELAY_MS
  },
  reconnectOnError(err) {
    const targetErrors = ['READONLY', 'ECONNRESET']
    return targetErrors.some((e) => err.message.includes(e))
  },
  lazyConnect: false,
  enableOfflineQueue: true,
})

redis.on('ready', () => {
  console.log('✅ Redis Connected and Ready')
})

redis.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code !== 'ECONNREFUSED') {
    console.error('❌ Redis Error:', error.message)
  }
})

export default redis
