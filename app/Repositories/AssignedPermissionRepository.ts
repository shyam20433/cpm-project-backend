import { Exception } from '@adonisjs/core/build/standalone'

import AssignedPermission from 'App/Models/AssignedPermission'

export default class AssignedPermissionRepository {
  public static async getAssignedPermissions(sort?: string) {
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
    query.limit(20)

    return  query
  }

  public static async getAssignedPermission(roleKey: string, permissionKey: string) {
    const assignedPermission=await   AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .preload('role')
      .preload('permission')
      .first()
     if (!assignedPermission){
      throw new Exception('AssignedPermission Not Found', 404,
        'E_ASSIGNED_PERMISSION_NOT_FOUND'

      )
     }

    return assignedPermission
  }

  public static async exists(roleKey: string, permissionKey: string) {
    return await  AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()

  }

  public static async create(data: any) {
    const exists = await this.exists(
      data.roleKey,
      data.permissionKey
    )

    if (exists) {
      throw new Exception(
        'Assigned permission already exists',
        409,
        'E_ASSIGNED_PERMISSION_EXISTS'
      )
    }

    return AssignedPermission.create(data)
  }

  public static async find(roleKey: string, permissionKey: string) {
    const assignedPermission= await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()


          if (!assignedPermission) {
            throw new Exception(
              'Assigned permission not found',
              404,
              'E_ASSIGNED_PERMISSION_NOT_FOUND'
            )
          }

      return assignedPermission

  }

  public static async update(
    assignedPermission: AssignedPermission,
    data: any
  ) {
    const newRoleKey = data.roleKey ?? assignedPermission.roleKey
    const newPermissionKey =
      data.permissionKey ?? assignedPermission.permissionKey

    const exists = await AssignedPermission.query()
      .where('roleKey', newRoleKey)
      .where('permissionKey', newPermissionKey)
      .first()

    if (
      exists &&
      (
        exists.roleKey !== assignedPermission.roleKey ||
        exists.permissionKey !== assignedPermission.permissionKey
      )
    ) {
      throw new Exception(
        'Assigned permission already exists',
        409,
        'E_ASSIGNED_PERMISSION_EXISTS'
      )
    }

    assignedPermission.merge(data)
    await assignedPermission.save()

    return assignedPermission
  }

  public static async delete(assignedPermission: AssignedPermission) {
    await assignedPermission.delete()
  }
}
