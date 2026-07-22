import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PermissionRepository from 'App/Repositories/PermissionRepository'

import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'
import CreatePermissionValidator from 'App/Validators/Permission/CreatePermissionValidator'
import DeletePermissionValidator from 'App/Validators/Permission/DeletePermissionValidator'
import UpdatePermissionValidator from 'App/Validators/Permission/UpdatePermissionValidator'
import GetPermissionValidator from 'App/Validators/Permission/GetPermissionValidator'

export default class PermissionsController {
  private permissionRepository = new PermissionRepository()
  public async getPermissions({ request, response }: HttpContextContract) {
    try {
      const filters = await request.validate(IsIncludeValidator)

      const permissions = await this.permissionRepository.getAll(filters)

      return response.send({
        success: true,
        message: 'Permissions fetched successfully',
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
      const permission = await this.permissionRepository.findByKey(key)
      return response.send({
        success: true,
        message: 'Permission fetched successfully',
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
      const permission = await this.permissionRepository.createPermission(data)

      return response.created({
        success: true,
        message: 'Permission created successfully',
        data: permission,
      })
    } catch (error: any) {
      return response.notAcceptable({
        success: false,
        message: 'Failed to create permission',
        error: error.messages || error.message,
      })
    }
  }

  public async updatePermission({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UpdatePermissionValidator)
      const {key ,...newData}=data;
      const permission = await this.permissionRepository.updatePermission(key, newData)
      return response.send({
        success: true,
        message: 'Permission updated successfully',
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
    const { key, updatestatus } = await request.validate(DeletePermissionValidator)

    try {
      let permission
      if (!updatestatus) {
        permission = await this.permissionRepository.disablePermission(key)
      } else {
        permission = await this.permissionRepository.enablePermission(key)
      }

      return response.send({
        success: true,
        message: updatestatus
          ? 'Permissions enabled successfully'
          : 'Permissions disabled successfully',
        data: permission,
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
