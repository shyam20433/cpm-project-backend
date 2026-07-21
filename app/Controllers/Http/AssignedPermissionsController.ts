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

      return response.status(200).send({
        success: true,
        message: 'assigned permissions fetched successfully',
        data: assignedPermissions,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch assigned permissions',
        error: error.messages || error.message,
      })
    }
  }

  public async getAssignedPermission({ request, response }: HttpContextContract) {
    try {
      const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)

      await CheckRoleExists.validate(roleKey)
      await CheckPermissionExists.validate(permissionKey)
      await CheckRoleActive.validate(roleKey)
      await CheckPermissionActive.validate(permissionKey)

      const assignedPermission = await AssignedPermission.query()
        .where('roleKey', roleKey)
        .where('permissionKey', permissionKey)
        .preload('role')
        .preload('permission')
        .first()

      if (!assignedPermission) {
        return response.notFound({
          success: false,
          message: 'Assigned permission not found',
        })
      }

      return response.status(200).send({
        success: true,
        message: 'assigned permission fetched successfully',
        data: assignedPermission,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch assigned permission',
        error: error.messages || error.message,
      })
    }
  }

  public async postAssignedPermission({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(CreateAssignedPermissionValidator)

      await CheckRoleExists.validate(data.roleKey)
      await CheckPermissionExists.validate(data.permissionKey)
      await CheckRoleActive.validate(data.roleKey)
      await CheckPermissionActive.validate(data.permissionKey)

      const exists = await AssignedPermission.query()
        .where('roleKey', data.roleKey)
        .where('permissionKey', data.permissionKey)
        .first()

      if (exists) {
        return response.badRequest({
          success: false,
          message: 'Assigned permission already exists',
        })
      }

      const assignedPermission = await AssignedPermission.create(data)

      return response.created(assignedPermission)
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to assign permission',
        error: error.messages || error.message,
      })
    }
  }

  public async updateAssignedPermission({ request, response }: HttpContextContract) {
    try {
      const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)

      await CheckRoleExists.validate(roleKey)
      await CheckPermissionExists.validate(permissionKey)
      await CheckRoleActive.validate(roleKey)
      await CheckPermissionActive.validate(permissionKey)

      const assignedPermission = await AssignedPermission.query()
        .where('roleKey', roleKey)
        .where('permissionKey', permissionKey)
        .first()

      if (!assignedPermission) {
        return response.notFound({
          success: false,
          message: 'Assigned permission not found',
        })
      }

      const data = await request.validate(UpdateAssignedPermissionValidator)

      const updatedRoleKey = data.roleKey ?? assignedPermission.roleKey
      const updatedPermissionKey = data.permissionKey ?? assignedPermission.permissionKey

      await CheckRoleExists.validate(updatedRoleKey)
      await CheckPermissionExists.validate(updatedPermissionKey)
      await CheckRoleActive.validate(updatedRoleKey)
      await CheckPermissionActive.validate(updatedPermissionKey)

      const duplicate = await AssignedPermission.query()
        .where('roleKey', updatedRoleKey)
        .where('permissionKey', updatedPermissionKey)
        .first()

      if (
        duplicate &&
        !(
          duplicate.roleKey === assignedPermission.roleKey &&
          duplicate.permissionKey === assignedPermission.permissionKey
        )
      ) {
        return response.badRequest({
          success: false,
          message: 'Assigned permission already exists',
        })
      }

      assignedPermission.merge(data)

      await assignedPermission.save()

      return response.status(200).send({
        success: true,
        message: 'assigned permission updated successfully',
        data: assignedPermission,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to update assigned permission',
        error: error.messages || error.message,
      })
    }
  }

  public async deleteAssignedPermission({ request, response }: HttpContextContract) {
    try {
      const { roleKey, permissionKey } = await request.validate(DeleteAssignedPermissionValidator)

      await CheckRoleExists.validate(roleKey)
      await CheckPermissionExists.validate(permissionKey)
      await CheckRoleActive.validate(roleKey)
      await CheckPermissionActive.validate(permissionKey)

      const assignedPermission = await AssignedPermission.query()
        .where('roleKey', roleKey)
        .where('permissionKey', permissionKey)
        .first()

      if (!assignedPermission) {
        return response.notFound({
          success: false,
          message: 'Assigned permission not found',
        })
      }

      await assignedPermission.delete()

      return response.status(200).send({
        success: true,
        message: 'assigned permission deleted successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to delete assigned permission',
        error: error.messages || error.message,
      })
    }
  }
}
