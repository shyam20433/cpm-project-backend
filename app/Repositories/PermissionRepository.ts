import Permission from 'App/Models/Permission'
import { Exception } from '@adonisjs/core/build/standalone'
import AuditLogRepository from './AuditLogRepository'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
const auditLogRepository = new AuditLogRepository()
export default class PermissionRepository {

  public getAll(filters: any) {
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

  public async createPermission(
    data: any,
    changedBy: string,
    trx: TransactionClientContract
  ) {
    const exists = await Permission.query().where('key', data.key).first()

    if (exists) {
      throw new Exception(
        'Permission already exists',
        409,
        'E_PERMISSION_EXISTS'
      )
    }

    const permission = await Permission.create(data, {
      client: trx,
    })

    await auditLogRepository.create(
      {
        tableName: 'permissions',
        recordId: permission.key,
        action: 'CREATE',
        oldData: null,
        newData: permission.toJSON(),
        changedBy,
      },
      trx
    )

    return permission
  }
  public async updatePermission(
    key: string,
    data: any,
    changedBy: string,
    trx: TransactionClientContract
  ) {
    const permission = await this.findByKey(key)

    const newKey = data.key ?? permission.key

    const exists = await Permission.query().where('key', newKey).first()

    if (exists && exists.key !== permission.key) {
      throw new Exception(
        'Permission already exists',
        409,
        'E_PERMISSION_EXISTS'
      )
    }

    const oldData = permission.toJSON()

    permission.merge(data)

    permission.useTransaction(trx)

    await permission.save()

    const newData = permission.toJSON()

    await auditLogRepository.create(
      {
        tableName: 'permissions',
        recordId: permission.key,
        action: 'UPDATE',
        oldData,
        newData,
        changedBy,
      },
      trx
    )

    return permission
  }

public async disablePermission(
  key: string,
  changedBy: string,
  trx: TransactionClientContract
) {
  const permission = await this.findByKey(key)

  const oldData = permission.toJSON()

  permission.status = false

  permission.useTransaction(trx)

  await permission.save()

  const newData = permission.toJSON()

  await auditLogRepository.create(
    {
      tableName: 'permissions',
      recordId: permission.key,
      action: 'DISABLE',
      oldData,
      newData,
      changedBy,
    },
    trx
  )

  return permission
}
public async enablePermission(
  key: string,
  changedBy: string,
  trx: TransactionClientContract
) {
  const permission = await this.findByKey(key)

  const oldData = permission.toJSON()

  permission.status = true

  permission.useTransaction(trx)

  await permission.save()

  const newData = permission.toJSON()

  await auditLogRepository.create(
    {
      tableName: 'permissions',
      recordId: permission.key,
      action: 'ENABLE',
      oldData,
      newData,
      changedBy,
    },
    trx
  )

  return permission
}
}
