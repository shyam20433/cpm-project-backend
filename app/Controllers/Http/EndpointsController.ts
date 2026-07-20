import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import AssignedPermission from 'App/Models/AssignedPermission'
import AssignedRole from 'App/Models/AssignedRole'
import Endpoint from 'App/Models/Endpoint'
import Permission from 'App/Models/Permission'

import CreateEndpointValidator from 'App/Validators/Endpoint/CreateEndpointValidator'
import DeleteEndpointValidator from 'App/Validators/Endpoint/DeleteEndpointValidator'
import GetAccessDetailsValidator from 'App/Validators/Endpoint/GetAccessDetailsValidator'
import GetEndpointValidator from 'App/Validators/Endpoint/GetEndpointValidator'
import UpdateEndpointValidator from 'App/Validators/Endpoint/UpdateEndpointValidator'

export default class EndpointsController {
  public async getEndpoints({ request, response }: HttpContextContract) {
    try {
      const { status, sort } = request.qs()

      const query = Endpoint.query()
      //.preload('permissions')

      if (status !== undefined) {
        query.where('status', status === 'true')
      }
      if (sort) {
        if (sort.startsWith('-')) {
          query.orderBy(sort.substring(1), 'desc')
        } else {
          query.orderBy(sort, 'asc')
        }
      }

      const endpoints = await query

      return response.ok(endpoints)
    } catch (error: any) {
      return response.badRequest({ message: error.messages || error.message })
    }
  }

  public async getEndpoint({ response, request }: HttpContextContract) {
    const { id } = await request.validate(GetEndpointValidator)
    try {
      const endpoint = await Endpoint.query().where('id', id).where('status', true).first()

      if (!endpoint) {
        return response.notFound({ message: 'Endpoint not found' })
      }

      return response.ok(endpoint)
    } catch (error: any) {
      return response.badRequest({ message: error.messages || error.message })
    }
  }

  public async postEndpoint({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateEndpointValidator)
    try {
      const endpoint = await Endpoint.create(data)
      return response.created(endpoint)
    } catch (error) {
      return response.notAcceptable({
        message: 'Endpoint already exists',
      })
    }
  }

  public async updateEndpoint({ request, response }: HttpContextContract) {
    const { id } = await request.validate(GetEndpointValidator)
    const endpoint = await Endpoint.find(id)

    if (!endpoint) {
      return response.notFound({ message: 'Endpoint not found' })
    }
    try {
      endpoint.merge(await request.validate(UpdateEndpointValidator))

      await endpoint.save()

      return response.ok(endpoint)
    } catch (error: any) {
      return response.badRequest({ message: error.messages || error.message })
    }
  }

  public async deleteEndpoint({ request, response }: HttpContextContract) {
    const { id } = await request.validate(DeleteEndpointValidator)
    const endpoint = await Endpoint.find(id)

    if (!endpoint) {
      return response.notFound({ message: 'Endpoint not found' })
    }

    try {
      endpoint.status = false

      await endpoint.save()

      return response.ok({
        message: 'Endpoint disabled successfully',
      })
    } catch (error: any) {
      return response.badRequest({ message: error.messages || error.message })
    }
  }
  public async getAccessDetails({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(GetAccessDetailsValidator)
      const endpoint = await Endpoint.query()
        .where('serviceId', data.service_id)
        .where('method', data.method)
        .where('route', data.route)
        .first()

      if (!endpoint) {
        return response.notFound({
          message: 'Endpoint not found',
        })
      }

      const assignedEndpoints = await AssignedEndpoint.query()
        .where('endpointId', endpoint.id)
        .preload('permission', (query) => query.select('key', 'name', 'description', 'status'))

      const permissionKeys = assignedEndpoints.map((item) => item.permissionKey)
      const assignedPermissions = await AssignedPermission.query()
        .whereIn('permissionKey', permissionKeys)
        .preload('role', (query) => query.select('key', 'name', 'description', 'status'))

      const roleKeys = [...new Set(assignedPermissions.map((item) => item.roleKey))]

      const assignedRoles = await AssignedRole.query()
        .whereIn('roleKey', roleKeys)
        .select('id', 'roleKey', 'email')

      return response.ok({
        endpoint,
        permissions: assignedEndpoints.map((item) => item.permission),
        roles: assignedPermissions.map((item) => item.role),
        users: assignedRoles,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.message || error.messages,
      })
    }
  }
}
