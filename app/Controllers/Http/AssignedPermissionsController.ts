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
import AssignedPermissionsValidator from 'App/Validators/FetchAll/AssignedPermissionsValidator'

import AssignedPermissionRepository from 'App/Repositories/AssignedPermissionRepository'

export default class AssignedPermissionsController {
  public async getAssignedPermissions({ request, response }: HttpContextContract) {
    try {
      const qs = request.qs()
      const allowedParams = ['sort']
      const unknownParams = Object.keys(qs).filter((key) => !allowedParams.includes(key))

      if (unknownParams.length > 0) {
        return response.badRequest({
          success: false,
          message: 'Invalid query parameters',
          error: `Unknown fields: ${unknownParams.join(', ')}. Allowed: ${allowedParams.join(
            ', '
          )}`,
        })
      }
      const { sort } = await request.validate(AssignedPermissionsValidator)

      const assignedPermissions = await AssignedPermissionRepository.getAssignedPermissions(sort)

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

      const exists = await AssignedPermissionRepository.exists(data.roleKey, data.permissionKey)

      if (exists) {
        return response.badRequest({
          success: false,
          message: 'Assigned permission already exists',
        })
      }

      const assignedPermission = await AssignedPermissionRepository.create(data)

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
      await CheckRoleActive.validate(updatedRoleKey)
      await CheckPermissionActive.validate(updatedPermissionKey)

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

      return response.status(200).send({
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
      await CheckRoleActive.validate(roleKey)
      await CheckPermissionActive.validate(permissionKey)

      const assignedPermission = await AssignedPermissionRepository.find(roleKey, permissionKey)

      if (!assignedPermission) {
        return response.notFound({
          success: false,
          message: 'Assigned permission not found',
        })
      }

      await AssignedPermissionRepository.delete(assignedPermission)

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
