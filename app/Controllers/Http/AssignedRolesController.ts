import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedRole from 'App/Models/AssignedRole'

export default class AssignedRolesController {
  public async getAssignedRoles({ response }: HttpContextContract) {
    const assignedRoles = await AssignedRole.query().preload('role')

    return response.ok(assignedRoles)
  }

  public async getAssignedRole({ params, response }: HttpContextContract) {
    const assignedRole = await AssignedRole.find(params.id)

    if (!assignedRole) {
      return response.notFound({
        message: 'Assigned role not found',
      })
    }

    await assignedRole.load('role')

    return response.ok(assignedRole)
  }

  public async postAssignedRole({ request, response }: HttpContextContract) {
    const data = request.only(['roleKey', 'email'])

    try {
      const assignedRole = await AssignedRole.create(data)

      return response.created(assignedRole)
    } catch (error) {
      return response.notAcceptable({
        message: 'Role already assigned to this user',
      })
    }
  }

  public async updateAssignedRole({ params, request, response }: HttpContextContract) {
    const assignedRole = await AssignedRole.find(params.id)

    if (!assignedRole) {
      return response.notFound({
        message: 'Assigned role not found',
      })
    }

    assignedRole.merge(request.only(['roleKey', 'email']))

    await assignedRole.save()

    return response.ok(assignedRole)
  }

  public async deleteAssignedRole({ params, response }: HttpContextContract) {
    const assignedRole = await AssignedRole.find(params.id)

    if (!assignedRole) {
      return response.notFound({
        message: 'Assigned role not found',
      })
    }

    await assignedRole.delete()

    return response.ok({
      message: 'Assigned role deleted successfully',
    })
  }
}
