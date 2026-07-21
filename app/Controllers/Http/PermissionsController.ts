import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PermissionService from 'App/Services/PermissionService'

import CreatePermissionValidator from 'App/Validators/Permission/CreatePermissionValidator'
import DeletePermissionValidator from 'App/Validators/Permission/DeletePermissionValidator'
import UpdatePermissionValidator from 'App/Validators/Permission/UpdatePermissionValidator'
import GetPermissionValidator from 'App/Validators/Permission/GetPermissionValidator'

export default class PermissionsController {
  private permissionService = new PermissionService()
  public async getPermissions({ request, response }: HttpContextContract) {
    try {
      const permissions = await this.permissionService.getPermissions(request.qs())

      return response.status(200).send({
        success: true,
        message: 'permissions fetched successfully',
        data: permissions,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch permissions',
        error: error.messages || error.message,
      })
    }
  }
  public async getPermission({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetPermissionValidator)
    try {
      const permission = await this.permissionService.getPermission(key)
      if (!permission) {
        return response.notFound({
          success: false,
          message: 'Permission not found',
        })
      }
      return response.status(200).send({
        success: true,
        message: 'permission fetched successfully',
        data: permission,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch permission',
        error: error.messages || error.message,
      })
    }
  }

  public async postPermission({ request, response }: HttpContextContract) {
    const data = await request.validate(CreatePermissionValidator)
    try {
      const permission = await this.permissionService.createPermission(data)
      return response.created(permission)
    } catch (error: any) {
      return response.notAcceptable({
        success: false,
        message: 'Failed to create permission',
        error: error.messages || error.message,
      })
    }
  }
  public async updatePermission({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetPermissionValidator)
    const data = await request.validate(UpdatePermissionValidator)
    try {
      const permission = await this.permissionService.updatePermission(key, data)

      if (!permission) {
        return response.notFound({
          success: false,
          message: 'Permission not found',
        })
      }
      return response.status(200).send({
        success: true,
        message: 'permission updated successfully',
        data: permission,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to update permission',
        error: error.messages || error.message,
      })
    }
  }
  public async deletePermission({ request, response }: HttpContextContract) {
    const { key } = await request.validate(DeletePermissionValidator)
    try {
      const permission = await this.permissionService.disablePermission(key)
      if (!permission) {
        return response.notFound({
          success: false,
          message: 'Permission not found',
        })
      }
      return response.status(200).send({
        success: true,
        message: 'permission disabled successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to disable permission',
        error: error.messages || error.message,
      })
    }
  }
}
