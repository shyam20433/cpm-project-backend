import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/GetAssignedEndpointValidator'
import CreateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/CreateAssignedEndpointValidator'
import DeleteAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/DeleteAssignedEndpointValidator'
import UpdateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/UpdateAssignedEndpointValidator'
import AssignedEndpointsValidator from 'App/Validators/FetchAll/AssignedEndpointsValidator'

import CheckEndpointExists from 'App/Validators/Exists/CheckEndpointExists'
import CheckPermissionExists from 'App/Validators/Exists/CheckPermissionExists'
import CheckEndpointActive from 'App/Validators/Active/CheckEndpointActive'
import CheckPermissionActive from 'App/Validators/Active/CheckPermissionActive'

import AssignedEndpointRepository from 'App/Repositories/AssignedEndpointRepository'

export default class AssignedEndpointsController {
  public async getAssignedEndpoints({ request, response }: HttpContextContract) {
    try {
      const qs = request.qs()

      try {
        AssignedEndpointsValidator.validateQueryParams(qs)
      } catch (error: any) {
        return response.badRequest({
          success: false,
          message: 'Invalid query parameters',
          error: error.message,
        })
      }
      const { sort } = await request.validate(AssignedEndpointsValidator)

      const assignedEndpoints = await AssignedEndpointRepository.getAssignedEndpoints(sort)

      return response.send({
        success: true,
        message: 'assigned endpoints fetched successfully',
        data: assignedEndpoints,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
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

      const assignedEndpoint = await AssignedEndpointRepository.getAssignedEndpoint(
        endpointId,
        permissionKey
      )

      if (!assignedEndpoint) {
        return response.notFound({
          message: 'Assigned endpoint not found',
        })
      }

      return response.send({
        success: true,
        message: 'assigned endpoint fetched successfully',
        data: assignedEndpoint,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
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
      const assignedEndpoint = await AssignedEndpointRepository.create(data)

      return response.created(assignedEndpoint)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }

  public async updateAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

    await CheckEndpointExists.validate(endpointId)
    await CheckPermissionExists.validate(permissionKey)
    await CheckEndpointActive.validate(endpointId)
    await CheckPermissionActive.validate(permissionKey)

    const assignedEndpoint = await AssignedEndpointRepository.find(endpointId, permissionKey)

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

      const updatedAssignedEndpoint = await AssignedEndpointRepository.update(
        assignedEndpoint,
        data
      )

      return response.send({
        success: true,
        message: 'assigned endpoint updated successfully',
        data: updatedAssignedEndpoint,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }

  public async deleteAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(DeleteAssignedEndpointValidator)
    await CheckEndpointExists.validate(endpointId)
    await CheckPermissionExists.validate(permissionKey)
    await CheckEndpointActive.validate(endpointId)
    await CheckPermissionActive.validate(permissionKey)

    const assignedEndpoint = await AssignedEndpointRepository.find(endpointId, permissionKey)

    if (!assignedEndpoint) {
      return response.notFound({
        message: 'Assigned endpoint not found',
      })
    }

    try {
      await AssignedEndpointRepository.delete(assignedEndpoint)

      return response.status(200).send({
        success: true,
        message: 'assigned endpoint deleted successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }
}
