import Permission from "App/Models/Permission"

export default class CheckPermissionExists {
  public static async validate(permissionKey: string) {
    const permission = await Permission.find(permissionKey)

    if (!permission) {
      throw new Error('permission does not exist')
    }

    return permission
  }
}
