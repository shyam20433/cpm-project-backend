import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import GetAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/GetAssignedEndpointValidator'
import CreateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/CreateAssignedEndpointValidator'
import DeleteAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/DeleteAssignedEndpointValidator'
import UpdateAssignedEndpointValidator from 'App/Validators/AssignedEndpoint/UpdateAssignedEndpointValidator'

export default class AssignedEndpointsController {
  public async getAssignedEndpoints({ response }: HttpContextContract) {
    const assignedEndpoints = await AssignedEndpoint.query()
      .preload('endpoint')
      .preload('permission')

    return response.ok(assignedEndpoints)
  }

  public async getAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)
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
  }

  public async postAssignedEndpoint({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAssignedEndpointValidator)

    try {
      const assignedEndpoint = await AssignedEndpoint.create(data)

      return response.created(assignedEndpoint)
    } catch (error) {
      return response.notAcceptable({
        message: 'Endpoint already assigned to permission',
      })
    }
  }

  public async updateAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(GetAssignedEndpointValidator)

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
      assignedEndpoint.merge(await request.validate(UpdateAssignedEndpointValidator))

      await assignedEndpoint.save()

      return response.ok(assignedEndpoint)
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async deleteAssignedEndpoint({ request, response }: HttpContextContract) {
    const { endpointId, permissionKey } = await request.validate(DeleteAssignedEndpointValidator)

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
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }
}
