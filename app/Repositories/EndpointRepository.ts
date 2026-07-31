import Endpoint from 'App/Models/Endpoint'
import { Exception } from '@adonisjs/core/build/standalone'
import AuditLogRepository from './AuditLogRepository'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
const auditRepository = new AuditLogRepository()
export default class EndpointRepository {
  public getAll(filters: any) {
    const { include, sort } = filters

    const query = Endpoint.query()

    // .preload('permissions')

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

    return query
  }

  public async findById(id: number) {
    const endpoint = await Endpoint.find(id)
      if (!endpoint) {
    throw new Exception(
      'Endpoint not found',
      404,
      'E_ENDPOINT_NOT_FOUND'
    )
  }
    return endpoint
  }

public async createEndpoint(
  data: any,
  changedBy: string,
  trx: TransactionClientContract
) {
  const exists = await Endpoint.query()
    .where('serviceId', data.serviceId)
    .where('method', data.method)
    .where('route', data.route)
    .first()

  if (exists) {
    throw new Exception(
      'Endpoint already exists',
      409,
      'E_ENDPOINT_EXISTS'
    )
  }

  const endpoint = await Endpoint.create(data, {
    client: trx,
  })

  await auditRepository.create(
    {
      tableName: 'endpoints',
      recordId: endpoint.id.toString(),
      action: 'CREATE',
      newData: endpoint.toJSON(),
      changedBy,
    },
    trx
  )

  return endpoint
}

public async updateEndpoint(
  id: number,
  data: any,
  changedBy: string,
  trx: TransactionClientContract
) {
  const endpoint = await Endpoint.findOrFail(id)
  const oldData = endpoint.toJSON()
  const newServiceId = data.serviceId ?? endpoint.serviceId
  const newMethod = data.method ?? endpoint.method
  const newRoute = data.route ?? endpoint.route
  const exists = await Endpoint.query()
    .where('serviceId', newServiceId)
    .where('method', newMethod)
    .where('route', newRoute)
    .first()

  if (exists && exists.id !== endpoint.id) {
    throw new Exception(
      'Endpoint already exists',
      409,
      'E_ENDPOINT_EXISTS'
    )
  }

  endpoint.merge(data)

  await endpoint.useTransaction(trx).save()

  await auditRepository.create(
    {
      tableName: 'endpoints',
      recordId: endpoint.id.toString(),
      action: 'UPDATE',
      oldData,
      newData: endpoint.toJSON(),
      changedBy,
    },
    trx
  )

  return endpoint
}
public async disableEndpoint(
  id: number,
  changedBy: string,
  trx: TransactionClientContract
) {
  const endpoint = await Endpoint.findOrFail(id)

  const oldData = endpoint.toJSON()

  endpoint.status = false

  await endpoint.save()

  await auditRepository.create(
    {
      tableName: 'endpoints',
      recordId: endpoint.id.toString(),
      action: 'UPDATE',
      oldData,
      newData: endpoint.toJSON(),
      changedBy,
    },
    trx
  )

  return endpoint
}
  public async enableEndpoint(
id: number,
  changedBy: string,
  trx: TransactionClientContract
) {
  const endpoint = await Endpoint.findOrFail(id)

  const oldData = endpoint.toJSON()

  endpoint.status = true

  await endpoint.save()

  await auditRepository.create(
    {
      tableName: 'endpoints',
      recordId: endpoint.id.toString(),
      action: 'UPDATE',
      oldData,
      newData: endpoint.toJSON(),
      changedBy,
    },
    trx
  )

  return endpoint
}

  public async getAccessDetails(data: any) {
    const includeAll = data.include === 'all'

    const endpoint = await Endpoint.query()
      .where('serviceId', data.serviceId)
      .where('method', data.method)
      .where('route', data.route)
      .preload('permissions', (permissionsQuery) => {
        if (!includeAll) {
          permissionsQuery.where('status', true)
        }
        permissionsQuery.preload('roles', (rolesQuery) => {
          if (!includeAll) {
            rolesQuery.where('status', true)
          }
          rolesQuery.preload('assignedRoles')
        })
      })
      .first()

    if (!endpoint) {
      throw new Exception(
        'Endpoint not found',
        404,
        'E_ENDPOINT_NOT_FOUND'
      )
    }
    const permissionsMap = new Map()
    const rolesMap = new Map()
    const usersSet = new Set()

    for (const permission of endpoint.permissions) {
      let hasAccess = false

      for (const role of permission.roles) {
        if (role.assignedRoles.length > 0) {
          hasAccess = true
          rolesMap.set(role.key, {
            key: role.key
          })

          for (const assignedRole of role.assignedRoles) {
            usersSet.add(assignedRole.email)
          }
        }
      }

      if (hasAccess) {
        permissionsMap.set(permission.key, {
          key: permission.key,
          name: permission.name,
          description: permission.description,
          status: permission.status,
        })
      }
    }

    delete (endpoint as any).$preloaded.permissions

    return {
      endpoint,
      permissions: [...permissionsMap.values()],
      roles: [...rolesMap.keys()],
      users: [...usersSet],
    }
  }
}
