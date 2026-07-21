import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedRole from 'App/Models/AssignedRole'

import GetAssignedRoleValidator from 'App/Validators/AssignedRole/GetAssignedRoleValidator'
import CreateAssignedRoleValidator from 'App/Validators/AssignedRole/CreateAssignedRoleValidator'
import UpdateAssignedRoleValidator from 'App/Validators/AssignedRole/UpdateAssignedRoleValidator'
import DeleteAssignedRoleValidator from 'App/Validators/AssignedRole/DeleteAssignedRoleValidator'

import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import CheckRoleActive from 'App/Validators/Active/CheckRoleActive'
export default class AssignedRolesController {
  public async getAssignedRoles({ request, response }: HttpContextContract) {
    try {
      const { sort } = request.qs()
      const query = AssignedRole.query()
        .whereHas('role', (query) => {
          query.where('status', true)
        })
        .preload('role')
      const allowedSorts = ['id', 'email', 'roleKey']
      if (sort) {
        const direction = sort.startsWith('-') ? 'desc' : 'asc'
        const column = sort.startsWith('-') ? sort.substring(1) : sort
        if (allowedSorts.includes(column)) {
          query.orderBy(column, direction)
        }
      }
      const assignedRoles = await query
      return response.status(200).send({
        success: true,
        message: 'assigned roles fetched successfully',
        data: assignedRoles,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch assigned roles',
        error: error.messages || error.message,
      })
    }
  }

  public async getAssignedRole({ request, response }: HttpContextContract) {
    const { id } = await request.validate(GetAssignedRoleValidator)
    try {
      const assignedRole = await AssignedRole.find(id)

      if (!assignedRole) {
        return response.notFound({
          success: false,
          message: 'Assigned role not found',
        })
      }
      await CheckRoleExists.validate(assignedRole.roleKey)
      await CheckRoleActive.validate(assignedRole.roleKey)

      await assignedRole.load('role')

      return response.status(200).send({
        success: true,
        message: 'assigned role fetched successfully',
        data: assignedRole,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch assigned role',
        error: error.messages || error.message,
      })
    }
  }

  public async postAssignedRole({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAssignedRoleValidator)
    await CheckRoleExists.validate(data.roleKey)
    await CheckRoleActive.validate(data.roleKey)
    try {
      const assignedRole = await AssignedRole.create(data)

      return response.created(assignedRole)
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to assign role',
        error: error.messages || error.message,
      })
    }
  }
  public async updateAssignedRole({ request, response }: HttpContextContract) {
    const { id } = await request.validate(GetAssignedRoleValidator)

    const assignedRole = await AssignedRole.find(id)

    if (!assignedRole) {
      return response.notFound({
        success: false,
        message: 'Assigned role not found',
      })
    }

    try {
      const data = await request.validate(UpdateAssignedRoleValidator)

      const roleKey = data.roleKey ?? assignedRole.roleKey

      await CheckRoleExists.validate(roleKey)
      await CheckRoleActive.validate(roleKey)

      assignedRole.merge(data)

      await assignedRole.save()

      return response.status(200).send({
        success: true,
        message: 'assigned role updated successfully',
        data: assignedRole,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to update assigned role',
        error: error.messages || error.message,
      })
    }
  }

  public async deleteAssignedRole({ request, response }: HttpContextContract) {
    const { id } = await request.validate(DeleteAssignedRoleValidator)

    const assignedRole = await AssignedRole.find(id)

    if (!assignedRole) {
      return response.notFound({
        success: false,
        message: 'Assigned role not found',
      })
    }

    try {
      await CheckRoleExists.validate(assignedRole.roleKey)
      await CheckRoleActive.validate(assignedRole.roleKey)
      await assignedRole.delete()

      return response.status(200).send({
        success: true,
        message: 'assigned role deleted successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to delete assigned role',
        error: error.messages || error.message,
      })
    }
  }
}
