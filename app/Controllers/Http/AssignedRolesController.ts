import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedRole from 'App/Models/AssignedRole'
import GetAssignedRoleValidator from 'App/Validators/AssignedRole/GetAssignedRoleValidator'
import CreateAssignedRoleValidator from 'App/Validators/AssignedRole/CreateAssignedRoleValidator'
import UpdateAssignedRoleValidator from 'App/Validators/AssignedRole/UpdateAssignedRoleValidator'
import DeleteAssignedRoleValidator from 'App/Validators/AssignedRole/DeleteAssignedRoleValidator'

import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'

export default class AssignedRolesController {
  public async getAssignedRoles({ request, response }: HttpContextContract) {
    const { sort } = request.qs()
    const query = AssignedRole.query().preload('role')
    const allowedSorts = ['id', 'email', 'roleKey']
    if (sort) {
      const direction = sort.startsWith('-') ? 'desc' : 'asc'
      const column = sort.startsWith('-') ? sort.substring(1) : sort
      if (allowedSorts.includes(column)) {
        query.orderBy(column, direction)
      }
    }
    const assignedRoles = await query
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
    await CheckRoleExists.validate(assignedRole.roleKey)

    await assignedRole.load('role')

    return response.ok(assignedRole)
  }

  public async postAssignedRole({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAssignedRoleValidator)
    await CheckRoleExists.validate(data.roleKey)
    try {
      const assignedRole = await AssignedRole.create(data)

      return response.created(assignedRole)
    } catch (error) {
      return response.badRequest({
        message: error.message,
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
      const data = await request.validate(UpdateAssignedRoleValidator)
      if (data.roleKey) {
        await CheckRoleExists.validate(data.roleKey)
      }
      assignedRole.merge(data)

      await assignedRole.save()

      return response.ok(assignedRole)
    } catch (error) {
      console.log(error)
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
