import Role from 'App/Models/Role'
import { Exception } from '@adonisjs/core/build/standalone'

export default class CheckRoleExists {
  public static async validate(roleKey: string) {
    const role = await Role.find(roleKey)

    if (!role) {
      throw new Exception(
        'Role does not exist',
        404,
        'E_ROLE_NOT_FOUND'
      )
    }
    if (!role?.status) {
      throw new Exception(
        'Role is inactive',
        400,
        'E_ROLE_INACTIVE'
      )
    }

    return role
  }
}
