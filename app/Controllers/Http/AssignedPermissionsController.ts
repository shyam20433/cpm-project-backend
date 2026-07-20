import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedPermission from 'App/Models/AssignedPermission'
import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import CheckPermissionExists from 'App/Validators/Exists/CheckPermissionExists'

import GetAssignedPermissionValidator from 'App/Validators/AssignedPermission/GetAssignedPermissionValidator'
import CreateAssignedPermissionValidator from 'App/Validators/AssignedPermission/CreateAssignedPermissionValidator'
import DeleteAssignedPermissionValidator from 'App/Validators/AssignedPermission/DeleteAssignedPermissionValidator'
import UpdateAssignedPermissionValidator from 'App/Validators/AssignedPermission/UpdateAssignedPermissionValidator'

export default class AssignedPermissionsController {
  public async getAssignedPermissions({ request, response }: HttpContextContract) {
    const { sort } = request.qs()

    const query = AssignedPermission.query().preload('role').preload('permission')

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
  }

  public async getAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)
    await CheckPermissionExists.validate(permissionKey)
    await CheckRoleExists.validate(roleKey)
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
  }

  public async postAssignedPermission({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAssignedPermissionValidator)
    await CheckRoleExists.validate(data.roleKey)
    await CheckPermissionExists.validate(data.permissionKey)
    try {
      const assignedPermission = await AssignedPermission.create(data)

      return response.created(assignedPermission)
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async updateAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)
    await CheckPermissionExists.validate(permissionKey)
    await CheckRoleExists.validate(roleKey)
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

      if (data.roleKey) {
        await CheckRoleExists.validate(data.roleKey)
      }

      if (data.permissionKey) {
        await CheckPermissionExists.validate(data.permissionKey)
      }

      assignedPermission.merge(data)

      await assignedPermission.save()

      return response.ok(assignedPermission)
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async deleteAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(DeleteAssignedPermissionValidator)
    await CheckPermissionExists.validate(permissionKey)
    await CheckRoleExists.validate(roleKey)
    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()

    if (!assignedPermission) {
      return response.notFound({
        message: 'Assigned permission not found',
      })
    }

    await assignedPermission.delete()

    return response.ok({
      message: 'Assigned permission deleted successfully',
    })
  }
}
