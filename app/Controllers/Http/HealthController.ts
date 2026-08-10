import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HealthRepository from 'App/Repositories/HealthRepository'

export default class HealthController {
  private healthRepository = new HealthRepository()

  public async index({ response }: HttpContextContract) {
    const health = await this.healthRepository.checkHealth()

    if (!health.success) {
      return response.status(503).send(health)
    }

    return {
      status:true,
      message:'Health Details',
      health:health
    }
  }
}
