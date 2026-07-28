import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/GetAssignedEndpointValidator'
import CreateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/CreateAssignedEndpointValidator'
import DeleteAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/DeleteAssignedEndpointValidator'
import UpdateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/UpdateAssignedEndpointValidator'
import AssignedEndpointsValidator from 'App/Validators/FetchAll/AssignedEndpointsValidator'

import CheckEndpointExists from 'App/Validators/Exists/CheckEndpointExists'
import CheckPermissionExists from 'App/Validators/Exists/CheckPermissionExists'

import AssignedEndpointRepository from 'App/Repositories/AssignedEndpointRepository'

export default class AssignedEndpointsController {
public async getAssignedEndpoints({ request, response }: HttpContextContract) {
  try {
    const { sort } = await request.validate(AssignedEndpointsValidator)

    const assignedEndpoints = await AssignedEndpointRepository.getAssignedEndpoints(sort)

    return response.ok({
      success: true,
      message: 'Assigned endpoints fetched successfully',
      data: assignedEndpoints,
    })
  } catch (error: any) {
    return response.badRequest({
      success: false,
      message: error.messages ? 'Invalid query parameters' : 'Failed to fetch assigned endpoints',
      error: error.messages || error.message,
    })
  }
}

  public async getAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

    try {
      await CheckEndpointExists.validate(endpointId)
      await CheckPermissionExists.validate(permissionKey)

      const assignedEndpoint = await AssignedEndpointRepository.getAssignedEndpoint(
        endpointId,
        permissionKey
      )

      if (!assignedEndpoint) {
        return response.notFound({
          success: false,
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
        success: false,
        message: 'Failed to fetch assigned endpoint',
        error: error.messages || error.message,
      })
    }
  }

  public async postAssignedEndpoint({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(CreateAssignedEndpointValidator)
      await CheckPermissionExists.validate(data.permissionKey)
      await CheckEndpointExists.validate(data.endpointId)

      const assignedEndpoint = await AssignedEndpointRepository.create(data)

      return response.created({
        success: true,
        message: 'assigned endpoint created successfully',
        data: assignedEndpoint,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to assign endpoint',
        error: error.messages || error.message,
      })
    }
  }

  public async updateAssignedEndpoint({ request, response }: HttpContextContract) {
    try {
      const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

      await CheckEndpointExists.validate(endpointId)
      await CheckPermissionExists.validate(permissionKey)

      const assignedEndpoint = await AssignedEndpointRepository.find(endpointId, permissionKey)

      if (!assignedEndpoint) {
        return response.notFound({
          success: false,
          message: 'Assigned endpoint not found',
        })
      }

      const data = await request.validate(UpdateAssignedEndpointValidator)

      const updatedEndpointId = data.endpointId ?? assignedEndpoint.endpointId
      const updatedPermissionKey = data.permissionKey ?? assignedEndpoint.permissionKey

      await CheckEndpointExists.validate(updatedEndpointId)

      await CheckPermissionExists.validate(updatedPermissionKey)

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
        success: false,
        message: 'Failed to update assigned endpoint',
        error: error.messages || error.message,
      })
    }
  }

  public async deleteAssignedEndpoint({ request, response }: HttpContextContract) {
    try {
      const { endpointId, permissionKey } = await request.validate(DeleteAssignedEndpointValidator)
      await CheckEndpointExists.validate(endpointId)
      await CheckPermissionExists.validate(permissionKey)

      const assignedEndpoint = await AssignedEndpointRepository.find(endpointId, permissionKey)

      if (!assignedEndpoint) {
        return response.notFound({
          success: false,
          message: 'Assigned endpoint not found',
        })
      }

      await AssignedEndpointRepository.delete(assignedEndpoint)

      return response.send({
        success: true,
        message: 'assigned endpoint deleted successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to delete assigned endpoint',
        error: error.messages || error.message,
      })
    }
  }
}
