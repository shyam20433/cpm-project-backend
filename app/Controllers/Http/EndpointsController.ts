import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Endpoint from 'App/Models/Endpoint'

export default class EndpointsController {
  public async getEndpoints({ response }: HttpContextContract) {
    const endpoints = await Endpoint.query().preload('permissions')

    return response.ok(endpoints)
  }

  public async getEndpoint({ params, response }: HttpContextContract) {
    const endpoint = await Endpoint.query().preload('permissions').where('id', params.id).first()

    if (!endpoint) {
      return response.notFound({ message: 'Endpoint not found' })
    }

    return response.ok(endpoint)
  }

  public async postEndpoint({ request, response }: HttpContextContract) {
    const data = request.only(['method', 'route', 'serviceId', 'status'])
    try {
      const endpoint = await Endpoint.create(data)
      return response.created(endpoint)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  public async updateEndpoint({ params, request, response }: HttpContextContract) {
    const endpoint = await Endpoint.find(params.id)

    if (!endpoint) {
      return response.notFound({ message: 'Endpoint not found' })
    }
    try {
      endpoint.merge(request.only(['method', 'route', 'serviceId', 'status']))

      await endpoint.save()

      return response.ok(endpoint)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  public async deleteEndpoint({ params, response }: HttpContextContract) {
    const endpoint = await Endpoint.find(params.id)

    if (!endpoint) {
      return response.notFound({ message: 'Endpoint not found' })
    }

    endpoint.status = false

    await endpoint.save()

    return response.ok({
      message: 'Endpoint disabled successfully',
    })
  }
}
