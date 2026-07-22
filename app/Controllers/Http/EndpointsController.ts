import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import EndpointRepository from 'App/Repositories/EndpointRepository'

import CreateEndpointValidator from 'App/Validators/Endpoint/CreateEndpointValidator'
import DeleteEndpointValidator from 'App/Validators/Endpoint/DeleteEndpointValidator'
import GetAccessDetailsValidator from 'App/Validators/Endpoint/GetAccessDetailsValidator'
import GetEndpointValidator from 'App/Validators/Endpoint/GetEndpointValidator'
import UpdateEndpointValidator from 'App/Validators/Endpoint/UpdateEndpointValidator'
import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'

export default class EndpointsController {
  private endpointRepository = new EndpointRepository()

  public async getEndpoints({ request, response }: HttpContextContract) {
    try {
      const filters = await request.validate(IsIncludeValidator)

      const endpoints = await this.endpointRepository.getAll(filters)

      return response.ok({
        success: true,
        message: 'Endpoints fetched successfully',
        data: endpoints,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch endpoints',
        error: error.messages || error.message,
      })
    }
  }

  public async getEndpoint({ request, response }: HttpContextContract) {
    const { id } = await request.validate(GetEndpointValidator)

    try {
      const endpoint = await this.endpointRepository.findById(id)
      return response.ok({
        success: true,
        message: 'Endpoint fetched successfully',
        data: endpoint,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch endpoint',
        error: error.messages || error.message,
      })
    }
  }

  public async postEndpoint({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateEndpointValidator)

    try {
      const endpoint = await this.endpointRepository.createEndpoint(data)

      return response.created({
        success: true,
        message: 'Endpoint created successfully',
        data: endpoint,
      })
    } catch (error: any) {
      return response.notAcceptable({
        success: false,
        message: 'Endpoint already exists',
        error: error.messages || error.message,
      })
    }
  }

  public async updateEndpoint({ request, response }: HttpContextContract) {
    const { id } = await request.validate(GetEndpointValidator)
    const data = await request.validate(UpdateEndpointValidator)

    try {
      const endpoint = await this.endpointRepository.updateEndpoint(id, data)
      return response.ok({
        success: true,
        message: 'Endpoint updated successfully',
        data: endpoint,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to update endpoint',
        error: error.messages || error.message,
      })
    }
  }

  public async deleteEndpoint({ request, response }: HttpContextContract) {
    try {
      const { id, updatestatus } = await request.validate(DeleteEndpointValidator)

      let endpoint

      if (!updatestatus) {
        endpoint = await this.endpointRepository.disableEndpoint(id)
      } else {
        endpoint = await this.endpointRepository.enableEndpoint(id)
      }
      return response.ok({
        success: true,
        message: updatestatus ? 'Endpoint enabled successfully' : 'Endpoint disabled successfully',
        data: endpoint,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to update endpoint status',
        error: error.messages || error.message,
      })
    }
  }

  public async getAccessDetails({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(GetAccessDetailsValidator)

      const accessDetails = await this.endpointRepository.getAccessDetails(data)
      return response.ok({
        success: true,
        message: 'Access details fetched successfully',
        data: accessDetails,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch access details',
        error: error.messages || error.message,
      })
    }
  }
}
