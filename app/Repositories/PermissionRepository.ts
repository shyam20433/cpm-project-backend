import Permission from 'App/Models/Permission'

export default class PermissionRepository {
  public async getAll(filters: any) {
    const { include, sort } = filters

    const query = Permission.query()

    if (include !== 'all') {
      query.where('status', true)
    }

    if (sort) {
      if (sort.startsWith('-')) {
        query.orderBy(sort.substring(1), 'desc')
      } else {
        query.orderBy(sort, 'asc')
      }
    }

    return await query
  }

  public async findByKey(key: string) {
    return await Permission.query().where('key', key).first()
  }

  public async createPermission(data: any) {
    const exists = await this.findByKey(data.key)

    if (exists) {
      throw new Error('Permission already exists')
    }

    return await Permission.create(data)
  }

  public async updatePermission(key: string, data: any) {
    const permission = await this.findByKey(key)

    if (!permission) {
      return null
    }

    permission.merge(data)

    await permission.save()

    return permission
  }

  public async disablePermission(key: string) {
    const permission = await this.findByKey(key)

    if (!permission) {
      return null
    }

    permission.status = false

    await permission.save()

    return permission
  }
}
