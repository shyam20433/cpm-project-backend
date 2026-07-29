import Permission from 'App/Models/Permission'
import { Exception } from '@adonisjs/core/build/standalone'
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
    query.limit(20)

    return query
  }

public async findByKey(key: string) {
  const permission = await Permission.query().where('key', key).first()

  if (!permission) {
    throw new Exception(
      'Permission not found',
      404,
      'E_PERMISSION_NOT_FOUND'
    )
  }

  return permission
}

  public async createPermission(data: any) {
    const exists = await Permission.query().where('key', data.key).first()

    if (exists) {
  throw new Exception(
    'Permission already exists',
    409,
    'E_PERMISSION_EXISTS'
  )
}

    return  Permission.create(data)
  }

public async updatePermission(key: string, data: any) {
  const permission = await this.findByKey(key)

  const newKey = data.key ?? permission.key

  const exists = await Permission.query()
    .where('key', newKey)
    .first()

  if (exists && exists.key !== permission.key) {
    throw new Exception(
      'Permission already exists',
      409,
      'E_PERMISSION_EXISTS'
    )
  }

  permission.merge(data)
  await permission.save()

  return permission
}

  public async disablePermission(key: string) {
    const permission = await this.findByKey(key)

    permission.status = false

    await permission.save()

    return permission
  }
public async enablePermission(key: string) {
  const permission = await this.findByKey(key)

  permission.status = true
  await permission.save()

  return permission
}
}
