import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedRole from 'App/Models/AssignedRole'
import GetAssignedRoleValidator from 'App/Validators/AssignedRole/GetAssignedRoleValidator'
import CreateAssignedRoleValidator from 'App/Validators/AssignedRole/CreateAssignedRoleValidator'
import UpdateAssignedRoleValidator from 'App/Validators/AssignedRole/UpdateAssignedRoleValidator'
import DeleteAssignedRoleValidator from 'App/Validators/AssignedRole/DeleteAssignedRoleValidator'

export default class AssignedRolesController {
  public async getAssignedRoles({ response }: HttpContextContract) {
    const assignedRoles = await AssignedRole.query().preload('role')

    return response.ok(assignedRoles)
  }

  public async getAssignedRole({ request, response }: HttpContextContract) {
    const { id } = await request.validate(GetAssignedRoleValidator)
    const assignedRole = await AssignedRole.find(id)

    if (!assignedRole) {
      return response.notFound({
        message: 'Assigned role not found',
      })
    }

    await assignedRole.load('role')

    return response.ok(assignedRole)
  }

  public async postAssignedRole({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAssignedRoleValidator)

    try {
      const assignedRole = await AssignedRole.create(data)

      return response.created(assignedRole)
    } catch (error) {
      return response.notAcceptable({
        message: 'Role already assigned to this user',
      })
    }
  }

  public async updateAssignedRole({ request, response }: HttpContextContract) {
    const { id } = await request.validate(GetAssignedRoleValidator)

    const assignedRole = await AssignedRole.find(id)

    if (!assignedRole) {
      return response.notFound({
        message: 'Assigned role not found',
      })
    }
    try {
      assignedRole.merge(await request.validate(UpdateAssignedRoleValidator))

      await assignedRole.save()

      return response.ok(assignedRole)
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async deleteAssignedRole({ request, response }: HttpContextContract) {
    const { id } = await request.validate(DeleteAssignedRoleValidator)

    const assignedRole = await AssignedRole.find(id)

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
