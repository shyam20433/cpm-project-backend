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
public async getAssignedEndpoints({ request }: HttpContextContract) {
    const { sort } = await request.validate(AssignedEndpointsValidator)
    const assignedEndpoint=await AssignedEndpointRepository.getAssignedEndpoints(sort)
    return {
      success: true,
      message: 'Assigned endpoints fetched successfully',
      data: assignedEndpoint,
    }
}
  public async getAssignedEndpoint({ request }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

      await CheckEndpointExists.validate(endpointId)
      await CheckPermissionExists.validate(permissionKey)

      const assignedEndpoint = await AssignedEndpointRepository.getAssignedEndpoint(
        endpointId,
        permissionKey)
      return {
        success: true,
        message: 'assigned endpoint fetched successfully',
        data: assignedEndpoint,
      }
}

  public async postAssignedEndpoint({ request }: HttpContextContract) {

      const data = await request.validate(CreateAssignedEndpointValidator)
      await CheckPermissionExists.validate(data.permissionKey)
      await CheckEndpointExists.validate(data.endpointId)

      const assignedEndpoint = await AssignedEndpointRepository.create(data)

      return {
        success: true,
        message: 'assigned endpoint created successfully',
        data: assignedEndpoint,
      }

  }

  public async updateAssignedEndpoint({ request }: HttpContextContract) {

      const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

      await CheckEndpointExists.validate(endpointId)
      await CheckPermissionExists.validate(permissionKey)

      const assignedEndpoint = await AssignedEndpointRepository.find(endpointId, permissionKey)


      const data = await request.validate(UpdateAssignedEndpointValidator)

      const updatedEndpointId = data.endpointId ?? assignedEndpoint.endpointId
      const updatedPermissionKey = data.permissionKey ?? assignedEndpoint.permissionKey

      await CheckEndpointExists.validate(updatedEndpointId)

      await CheckPermissionExists.validate(updatedPermissionKey)

      const updatedAssignedEndpoint = await AssignedEndpointRepository.update(
        assignedEndpoint,
        data
      )

      return {
        success: true,
        message: 'assigned endpoint updated successfully',
        data: updatedAssignedEndpoint,
      }
  }

  public async deleteAssignedEndpoint({ request }: HttpContextContract) {
      const { endpointId, permissionKey } = await request.validate(DeleteAssignedEndpointValidator)
      await CheckEndpointExists.validate(endpointId)
      await CheckPermissionExists.validate(permissionKey)

      const assignedEndpoint = await AssignedEndpointRepository.find(endpointId, permissionKey)

      await AssignedEndpointRepository.delete(assignedEndpoint)

      return {
        success: true,
        message: 'assigned endpoint deleted successfully',
      }

  }
}
