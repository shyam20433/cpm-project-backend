import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import EndpointRepository from 'App/Repositories/EndpointRepository'

import CreateEndpointValidator from 'App/Validators/Endpoint/CreateEndpointValidator'
import DeleteEndpointValidator from 'App/Validators/Endpoint/DeleteEndpointValidator'
import GetAccessDetailsValidator from 'App/Validators/Endpoint/GetAccessDetailsValidator'
import GetEndpointValidator from 'App/Validators/Endpoint/GetEndpointValidator'
import UpdateEndpointValidator from 'App/Validators/Endpoint/UpdateEndpointValidator'
import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'

const endpointRepository = new EndpointRepository()

export default class EndpointsController {
  public async getEndpoints({ request }: HttpContextContract) {
    const filters = await request.validate(IsIncludeValidator)

    const endpoints = await endpointRepository.getAll(filters)

    return {
      success: true,
      message: 'Endpoints fetched successfully',
      data: endpoints,
    }
  }

  public async getEndpoint({ request }: HttpContextContract) {
    const { id } = await request.validate(GetEndpointValidator)

    const endpoint = await endpointRepository.findById(id)

    return {
      success: true,
      message: 'Endpoint fetched successfully',
      data: endpoint,
    }
  }

  public async postEndpoint({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const data = await request.validate(CreateEndpointValidator)
      const authUser = request.authUser

      if (!authUser) {
        return response.unauthorized()
      }

      const changedBy = authUser.email

      const endpoint = await endpointRepository.createEndpoint(
        data,
        changedBy,
        trx
      )

      await trx.commit()

      return {
        success: true,
        message: 'Endpoint created successfully',
        data: endpoint,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async updateEndpoint({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const data = await request.validate(UpdateEndpointValidator)

      const { id, ...newData } = data

      const authUser = request.authUser

      if (!authUser) {
        return response.unauthorized()
      }

      const changedBy = authUser.email

      const endpoint = await endpointRepository.updateEndpoint(
        id,
        newData,
        changedBy,
        trx
      )

      await trx.commit()

      return {
        success: true,
        message: 'Endpoint updated successfully',
        data: endpoint,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async deleteEndpoint({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      const { id, updatestatus } = await request.validate(
        DeleteEndpointValidator
      )

      const authUser = request.authUser

      if (!authUser) {
        return response.unauthorized()
      }

      const changedBy = authUser.email

      let endpoint

      if (!updatestatus) {
        endpoint = await endpointRepository.disableEndpoint(
          id,
          changedBy,
          trx
        )
      } else {
        endpoint = await endpointRepository.enableEndpoint(
          id,
          changedBy,
          trx
        )
      }

      await trx.commit()

      return {
        success: true,
        message: updatestatus
          ? 'Endpoint enabled successfully'
          : 'Endpoint disabled successfully',
        data: endpoint,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public async getAccessDetails({ request }: HttpContextContract) {
    const data = await request.validate(GetAccessDetailsValidator)

    const accessDetails = await endpointRepository.getAccessDetails(data)

    return {
      success: true,
      message: 'Access details fetched successfully',
      data: accessDetails,
    }
  }
}
