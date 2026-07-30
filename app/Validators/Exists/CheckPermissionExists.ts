import Permission from 'App/Models/Permission'
import { Exception } from '@adonisjs/core/build/standalone'

export default class CheckPermissionExists {
  public static async validate(permissionKey: string) {
    const permission = await Permission.find(permissionKey)

    if (!permission) {
      throw new Exception(
        'permission does not exist',
        404,
        'E_PERMISSION_NOT_FOUND'
      )
    }
    if (!permission.status) {
      throw new Exception(
        'permission is Inactive',
        400,
        'E_PERMISSION_INACTIVE'
      )
    }

    return permission
  }
}
