import Permission from 'App/Models/Permission'

export default class CheckPermissionActive {
  public static async validate(roleKey: string) {
    const permission = await Permission.find(roleKey)

    if (!permission) {
      throw new Error('permission not found')
    }
    if (!permission?.status) {
      throw new Error('permission is active ')
    }

    return permission
  }
}
