import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import CheckPermissionExists from 'App/Validators/Exists/CheckPermissionExists'

import GetAssignedPermissionValidator from 'App/Validators/AssignedPermission/GetAssignedPermissionValidator'
import CreateAssignedPermissionValidator from 'App/Validators/AssignedPermission/CreateAssignedPermissionValidator'
import DeleteAssignedPermissionValidator from 'App/Validators/AssignedPermission/DeleteAssignedPermissionValidator'
import UpdateAssignedPermissionValidator from 'App/Validators/AssignedPermission/UpdateAssignedPermissionValidator'
import AssignedPermissionsValidator from 'App/Validators/FetchAll/AssignedPermissionsValidator'

import AssignedPermissionRepository from 'App/Repositories/AssignedPermissionRepository'

export default class AssignedPermissionsController {
  public async getAssignedPermissions({ request, response }: HttpContextContract) {
    try {
      const qs = request.qs()

      try {
        AssignedPermissionsValidator.validateQueryParams(qs)
      } catch (error: any) {
        return response.badRequest({
          success: false,
          message: 'Invalid query parameters',
          error: error.message,
        })
      }
      const { sort } = await request.validate(AssignedPermissionsValidator)

      const assignedPermissions = await AssignedPermissionRepository.getAssignedPermissions(sort)

      return response.send({
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

      const assignedPermission = await AssignedPermissionRepository.getAssignedPermission(
        roleKey,
        permissionKey
      )

      if (!assignedPermission) {
        return response.notFound({
          success: false,
          message: 'Assigned permission not found',
        })
      }

      return response.send({
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

      const exists = await AssignedPermissionRepository.exists(data.roleKey, data.permissionKey)

      if (exists) {
        return response.badRequest({
          success: false,
          message: 'Assigned permission already exists',
        })
      }

      const assignedPermission = await AssignedPermissionRepository.create(data)

      return response.created({
        success: true,
        message: 'assigned permission created successfully',
        data: assignedPermission,
      })
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

      const assignedPermission = await AssignedPermissionRepository.find(roleKey, permissionKey)

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

      const duplicate = await AssignedPermissionRepository.exists(
        updatedRoleKey,
        updatedPermissionKey
      )

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

      const updatedAssignedPermission = await AssignedPermissionRepository.update(
        assignedPermission,
        data
      )

      return response.send({
        success: true,
        message: 'assigned permission updated successfully',
        data: updatedAssignedPermission,
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

      const assignedPermission = await AssignedPermissionRepository.find(roleKey, permissionKey)

      if (!assignedPermission) {
        return response.notFound({
          success: false,
          message: 'Assigned permission not found',
        })
      }

      await AssignedPermissionRepository.delete(assignedPermission)

      return response.send({
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
