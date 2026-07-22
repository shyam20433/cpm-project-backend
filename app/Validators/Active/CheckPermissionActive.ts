import Permission from 'App/Models/Permission'

export default class CheckPermissionActive {
  public static async validate(permissionKey: string) {
    const permission = await Permission.find(permissionKey)

    if (!permission) {
      throw new Error('permission not found')
    }
    if (!permission?.status) {
      throw new Error('Permission is inactive')
    }

    return permission
  }
}
