import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedPermission from 'App/Models/AssignedPermission'

import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import CheckPermissionExists from 'App/Validators/Exists/CheckPermissionExists'
import CheckRoleActive from 'App/Validators/Active/CheckRoleActive'
import CheckPermissionActive from 'App/Validators/Active/CheckPermissionActive'
import GetAssignedPermissionValidator from 'App/Validators/AssignedPermission/GetAssignedPermissionValidator'
import CreateAssignedPermissionValidator from 'App/Validators/AssignedPermission/CreateAssignedPermissionValidator'
import DeleteAssignedPermissionValidator from 'App/Validators/AssignedPermission/DeleteAssignedPermissionValidator'
import UpdateAssignedPermissionValidator from 'App/Validators/AssignedPermission/UpdateAssignedPermissionValidator'

export default class AssignedPermissionsController {
  public async getAssignedPermissions({ request, response }: HttpContextContract) {
    try {
      const { sort } = request.qs()

      const query = AssignedPermission.query()
        .whereHas('role', (query) => {
          query.where('status', true).select('key', 'name', 'description', 'status')
        })
        .whereHas('permission', (query) => {
          query.where('status', true).select('key', 'name', 'description', 'status')
        })
        .preload('role')
        .preload('permission')

      const allowedSorts = ['roleKey', 'permissionKey']

      if (sort) {
        const direction = sort.startsWith('-') ? 'desc' : 'asc'
        const column = sort.startsWith('-') ? sort.substring(1) : sort

        if (allowedSorts.includes(column)) {
          query.orderBy(column, direction)
        }
      }

      const assignedPermissions = await query

      return response.ok(assignedPermissions)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }

  public async getAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)
    try {
      await CheckPermissionExists.validate(permissionKey)
      await CheckRoleExists.validate(roleKey)

      await CheckPermissionActive.validate(permissionKey)
      await CheckRoleActive.validate(roleKey)
      const assignedPermission = await AssignedPermission.query()
        .where('roleKey', roleKey)
        .where('permissionKey', permissionKey)
        .preload('role')
        .preload('permission')
        .first()

      if (!assignedPermission) {
        return response.notFound({
          message: 'Assigned permission not found',
        })
      }

      return response.ok(assignedPermission)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }

  public async postAssignedPermission({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAssignedPermissionValidator)
    await CheckRoleExists.validate(data.roleKey)
    await CheckPermissionExists.validate(data.permissionKey)
    await CheckPermissionActive.validate(data.permissionKey)
    await CheckRoleActive.validate(data.roleKey)
    try {
      const assignedPermission = await AssignedPermission.create(data)

      return response.created(assignedPermission)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }

  public async updateAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)
    await CheckPermissionExists.validate(permissionKey)
    await CheckRoleExists.validate(roleKey)
    await CheckPermissionActive.validate(permissionKey)
    await CheckRoleActive.validate(roleKey)
    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()

    if (!assignedPermission) {
      return response.notFound({
        message: 'Assigned permission not found',
      })
    }
    try {
      const data = await request.validate(UpdateAssignedPermissionValidator)

      const updatedRoleKey = data.roleKey ?? assignedPermission.roleKey
      const updatedPermissionKey = data.permissionKey ?? assignedPermission.permissionKey

      await CheckRoleExists.validate(updatedRoleKey)
      await CheckRoleActive.validate(updatedRoleKey)

      await CheckPermissionExists.validate(updatedPermissionKey)
      await CheckPermissionActive.validate(updatedPermissionKey)

      assignedPermission.merge(data)

      await assignedPermission.save()

      return response.ok(assignedPermission)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }

  public async deleteAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(DeleteAssignedPermissionValidator)
    await CheckPermissionExists.validate(permissionKey)
    await CheckRoleExists.validate(roleKey)
    await CheckPermissionActive.validate(permissionKey)
    await CheckRoleActive.validate(roleKey)
    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()

    if (!assignedPermission) {
      return response.notFound({
        message: 'Assigned permission not found',
      })
    }

    try {
      await assignedPermission.delete()

      return response.ok({
        message: 'Assigned permission deleted successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.messages || error.message,
      })
    }
  }
}
