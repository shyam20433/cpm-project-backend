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

    return await query
  }

  public static async getAssignedPermission(roleKey: string, permissionKey: string) {
    return await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .preload('role')
      .preload('permission')
      .first()
  }

  public static async exists(roleKey: string, permissionKey: string) {
    return await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()
  }

  public static async create(data: any) {
    return await AssignedPermission.create(data)
  }

  public static async find(roleKey: string, permissionKey: string) {
    return await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()
  }

  public static async update(assignedPermission: AssignedPermission, data: any) {
    const oldRoleKey = assignedPermission.roleKey
    const oldPermissionKey = assignedPermission.permissionKey

    await AssignedPermission.query()
      .where('roleKey', oldRoleKey)
      .where('permissionKey', oldPermissionKey)
      .update(data)

    assignedPermission.merge(data)
    return assignedPermission
  }

  public static async delete(assignedPermission: AssignedPermission) {
    await assignedPermission.delete()
  }
}
