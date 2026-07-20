import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import GetAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/GetAssignedEndpointValidator'
import CreateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/CreateAssignedEndpointValidator'
import DeleteAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/DeleteAssignedEndpointValidator'
import UpdateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/UpdateAssignedEndpointValidator'

import CheckEndpointExists from 'App/Validators/Exists/CheckEndpointExists'
import CheckPermissionExists from 'App/Validators/Exists/CheckPermissionExists'
import CheckEndpointActive from 'App/Validators/Active/CheckEndpointActive'
import CheckPermissionActive from 'App/Validators/Active/CheckPermissionActive'
export default class AssignedEndpointsController {
  public async getAssignedEndpoints({ request, response }: HttpContextContract) {
    try {
      const { sort } = request.qs()
      const query = AssignedEndpoint.query()
        .whereHas('endpoint', (query) => {
          query.where('status', true)
        })
        .whereHas('permission', (query) => {
          query.where('status', true)
        })
        .preload('endpoint')
        .preload('permission')
      const allowedSorts = ['endpointId', 'permissionKey']
      if (sort) {
        const direction = sort.startsWith('-') ? 'desc' : 'asc'
        const column = sort.startsWith('-') ? sort.substring(1) : sort
        if (allowedSorts.includes(column)) {
          query.orderBy(column, direction)
        }
      }

      const assignedEndpoints = await query

      return response.ok(assignedEndpoints)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }
  public async getAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

    try {
      await CheckEndpointExists.validate(endpointId)
      await CheckPermissionExists.validate(permissionKey)

      await CheckEndpointActive.validate(endpointId)
      await CheckPermissionActive.validate(permissionKey)
      const assignedEndpoint = await AssignedEndpoint.query()
        .where('endpointId', endpointId)
        .where('permissionKey', permissionKey)
        .preload('endpoint')
        .preload('permission')
        .first()

      if (!assignedEndpoint) {
        return response.notFound({
          message: 'Assigned endpoint not found',
        })
      }

      return response.ok(assignedEndpoint)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }

  public async postAssignedEndpoint({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAssignedEndpointValidator)
    await CheckPermissionExists.validate(data.permissionKey)
    await CheckEndpointExists.validate(data.endpointId)
    await CheckEndpointActive.validate(data.endpointId)
    await CheckPermissionActive.validate(data.permissionKey)

    try {
      const assignedEndpoint = await AssignedEndpoint.create(data)

      return response.created(assignedEndpoint)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }

  public async updateAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

    await CheckEndpointExists.validate(endpointId)
    await CheckPermissionExists.validate(permissionKey)
    await CheckEndpointActive.validate(endpointId)
    await CheckPermissionActive.validate(permissionKey)

    const assignedEndpoint = await AssignedEndpoint.query()
      .where('endpointId', endpointId)
      .where('permissionKey', permissionKey)
      .first()

    if (!assignedEndpoint) {
      return response.notFound({
        message: 'Assigned endpoint not found',
      })
    }

    try {
      const data = await request.validate(UpdateAssignedEndpointValidator)

      const updatedEndpointId = data.endpointId ?? assignedEndpoint.endpointId
      const updatedPermissionKey = data.permissionKey ?? assignedEndpoint.permissionKey

      await CheckEndpointExists.validate(updatedEndpointId)
      await CheckEndpointActive.validate(updatedEndpointId)

      await CheckPermissionExists.validate(updatedPermissionKey)
      await CheckPermissionActive.validate(updatedPermissionKey)

      assignedEndpoint.merge(data)

      await assignedEndpoint.save()

      return response.ok(assignedEndpoint)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }

  public async deleteAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(DeleteAssignedEndpointValidator)
    await CheckEndpointExists.validate(endpointId)
    await CheckPermissionExists.validate(permissionKey)
    await CheckEndpointActive.validate(endpointId)
    await CheckPermissionActive.validate(permissionKey)
    const assignedEndpoint = await AssignedEndpoint.query()
      .where('endpointId', endpointId)
      .where('permissionKey', permissionKey)
      .first()

    if (!assignedEndpoint) {
      return response.notFound({
        message: 'Assigned endpoint not found',
      })
    }
    try {
      await assignedEndpoint.delete()

      return response.ok({
        message: 'Assigned endpoint deleted successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }
}
