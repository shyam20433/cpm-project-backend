import Permission from 'App/Models/Permission'

export default class PermissionRepository {
  public async getAll(filters: any) {
    const { status, sort } = filters

    const query = Permission.query()
    //.preload('roles')
    //preload('endpoints')

    if (status !== undefined) {
      query.where('status', status === 'true')
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

  public async create(data: any) {
    return await Permission.create(data)
  }

  public async save(permission: Permission) {
    await permission.save()
    return permission
  }
}
