import Database from '@ioc:Adonis/Lucid/Database'
import redis from 'App/Services/Redis'

export default class HealthRepository {
  public async checkHealth() {
    const services = {
      server: 'UP',
      database: 'DOWN',
      redis: 'DOWN',
    }

    await Promise.all([
      Database.rawQuery('SELECT 1')
        .then(() => {
          services.database = 'UP'
        })
        .catch(() => {
          services.database = 'DOWN'
        }),

      redis.ping()
        .then((response) => {
          if (response === 'PONG') {
            services.redis = 'UP'
          }
        })
        .catch(() => {
          services.redis = 'DOWN'
        }),
    ])

    const isHealthy =
      services.database === 'UP' &&
      services.redis === 'UP'

    return {
      success: isHealthy,
      status: isHealthy ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      services,
    }
  }
}
