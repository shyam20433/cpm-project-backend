import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import EndpointRepository from 'App/Repositories/EndpointRepository'

import CreateEndpointValidator from 'App/Validators/Endpoint/CreateEndpointValidator'
import DeleteEndpointValidator from 'App/Validators/Endpoint/DeleteEndpointValidator'
import GetAccessDetailsValidator from 'App/Validators/Endpoint/GetAccessDetailsValidator'
import GetEndpointValidator from 'App/Validators/Endpoint/GetEndpointValidator'
import UpdateEndpointValidator from 'App/Validators/Endpoint/UpdateEndpointValidator'
import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'
const endpointRepository = new EndpointRepository()
export default class EndpointsController {


  public async getEndpoints({ request, response }: HttpContextContract) {
    try {
      const filters = await request.validate(IsIncludeValidator)

      const endpoints = await endpointRepository.getAll(filters)

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
console.log(id)
    try {
      const endpoint = await endpointRepository.findById(id)
      console.log(endpoint)
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
      const endpoint = await endpointRepository.createEndpoint(data)

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
    try {
      const data = await request.validate(UpdateEndpointValidator)
      const { id, ...newData } = data
      const endpoint = await endpointRepository.updateEndpoint(id, newData)
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
        endpoint = await endpointRepository.disableEndpoint(id)
      } else {
        endpoint = await endpointRepository.enableEndpoint(id)
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

      const accessDetails = await endpointRepository.getAccessDetails(data)
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
