import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'

export default class AssignedEndpointsController {
  public async getAssignedEndpoints({ response }: HttpContextContract) {
    const assignedEndpoints = await AssignedEndpoint.query()
      .preload('endpoint')
      .preload('permission')

    return response.ok(assignedEndpoints)
  }

  public async getAssignedEndpoint({ params, response }: HttpContextContract) {
    const assignedEndpoint = await AssignedEndpoint.query()
      .where('endpointId', params.endpointId)
      .where('permissionKey', params.permissionKey)
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
    const data = request.only([
      'endpointId',
      'permissionKey',
    ])

    try {
      const assignedEndpoint = await AssignedEndpoint.create(data)

      return response.created(assignedEndpoint)
    } catch (error) {
      return response.notAcceptable({
        message: 'Endpoint already assigned to permission',
      })
    }
  }

  public async updateAssignedEndpoint({ params, request, response }: HttpContextContract) {
    const assignedEndpoint = await AssignedEndpoint.query()
      .where('endpointId', params.endpointId)
      .where('permissionKey', params.permissionKey)
      .first()

    if (!assignedEndpoint) {
      return response.notFound({
        message: 'Assigned endpoint not found',
      })
    }

    assignedEndpoint.merge(
      request.only([
        'endpointId',
        'permissionKey',
      ])
    )

    await assignedEndpoint.save()

    return response.ok(assignedEndpoint)
  }

  public async deleteAssignedEndpoint({ params, response }: HttpContextContract) {
    const assignedEndpoint = await AssignedEndpoint.query()
      .where('endpointId', params.endpointId)
      .where('permissionKey', params.permissionKey)
      .first()

    if (!assignedEndpoint) {
      return response.notFound({
        message: 'Assigned endpoint not found',
      })
    }

    await assignedEndpoint.delete()

    return response.ok({
      message: 'Assigned endpoint deleted successfully',
    })
  }
}
