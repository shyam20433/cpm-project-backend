import Role from 'App/Models/Role'

export default class CheckRoleExists {
  public static async validate(roleKey: string) {
    const role = await Role.find(roleKey)

    if (!role) {
      throw new Error('Role does not exist')
    }

    return role
  }
}
