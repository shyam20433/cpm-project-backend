import PermissionRepository from 'App/Repositories/PermissionRepository'

export default class PermissionService {
  private repository = new PermissionRepository()

  public async getPermissions(filters: any) {
    return await this.repository.getAll(filters)
  }

  public async getPermission(key: string) {
    return await this.repository.findByKey(key)
  }

  public async createPermission(data: any) {
    const exists = await this.repository.findByKey(data.key)

    if (exists) {
      throw new Error('Permission already exists')
    }

    return await this.repository.create(data)
  }

  public async updatePermission(key: string, data: any) {
    const permission = await this.repository.findByKey(key)

    if (!permission) {
      return null
    }

    permission.merge(data)

    return await this.repository.save(permission)
  }

  public async disablePermission(key: string) {
    const permission = await this.repository.findByKey(key)

    if (!permission) {
      return null
    }

    permission.status = false

    return await this.repository.save(permission)
  }
}
