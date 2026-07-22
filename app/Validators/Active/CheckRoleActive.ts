import Role from 'App/Models/Role'

export default class CheckRoleActive {
  public static async validate(roleKey: string) {
    const role = await Role.find(roleKey)

    if (!role) {
      throw new Error('Roles not found')
    }
    if (!role?.status) {
      throw new Error('Role is inactive')
    }

    return role
  }
}
