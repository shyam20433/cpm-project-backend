import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PermissionRepository from 'App/Repositories/PermissionRepository'

import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'
import CreatePermissionValidator from 'App/Validators/Permission/CreatePermissionValidator'
import DeletePermissionValidator from 'App/Validators/Permission/DeletePermissionValidator'
import UpdatePermissionValidator from 'App/Validators/Permission/UpdatePermissionValidator'
import GetPermissionValidator from 'App/Validators/Permission/GetPermissionValidator'

const permissionRepository = new PermissionRepository()

export default class PermissionsController {
  public async getPermissions({ request }: HttpContextContract) {
      const filters = await request.validate(IsIncludeValidator)
      const permissions = await permissionRepository.getAll(filters)
      return {
        success: true,
        message: 'Permissions fetched successfully',
        data: permissions,
      }
  }

  public async getPermission({ request }: HttpContextContract) {
    const { key } = await request.validate(GetPermissionValidator)

      const permission = await permissionRepository.findByKey(key)
      return {
        success: true,
        message: 'Permission fetched successfully',
        data: permission,
      }
  }

  public async postPermission({ request }: HttpContextContract) {
    const data = await request.validate(CreatePermissionValidator)

      const permission = await permissionRepository.createPermission(data)

      return {
        success: true,
        message: 'Permission created successfully',
        data: permission,
      }
  }

  public async updatePermission({ request }: HttpContextContract) {

      const data = await request.validate(UpdatePermissionValidator)
      const { key, ...newData } = data
      const permission = await permissionRepository.updatePermission(key, newData)
      return {
        success: true,
        message: 'Permission updated successfully',
        data: permission,
      }
  }

  public async deletePermission({ request }: HttpContextContract) {
    const { key, updatestatus } = await request.validate(DeletePermissionValidator)

      let permission
      if (!updatestatus) {
        permission = await permissionRepository.disablePermission(key)
      } else {
        permission = await permissionRepository.enablePermission(key)
      }

      return {
        success: true,
        message: updatestatus
          ? 'Permissions enabled successfully'
          : 'Permissions disabled successfully',
        data: permission,
      }
  }
}
