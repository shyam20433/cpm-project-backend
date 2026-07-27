import Database from '@ioc:Adonis/Lucid/Database'
import Endpoint from 'App/Models/Endpoint'

export default class EndpointRepository {
  public async getAll(filters: any) {
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

    return await query
  }

  public async findById(id: number) {
    const endpoint = await Endpoint.query().where('id', id).first()
    if (!endpoint) {
      throw new Error('ENDPOINT NOT FOUND')
    }
    return endpoint
  }

  public async createEndpoint(data: any) {
    const exists = await Endpoint.query()
      .where('serviceId', data.serviceId)
      .where('method', data.method)
      .where('route', data.route)
      .first()

    if (exists) {
      throw new Error('Endpoint already exists')
    }

    return await Endpoint.create(data)
  }

  public async updateEndpoint(id: number, data: any) {
    const endpoint = await Endpoint.find(id)

    if (!endpoint) {
      throw new Error('NOT FOUND')
    }

    endpoint.merge(data)

    await endpoint.save()

    return endpoint
  }

  public async disableEndpoint(id: number) {
    const endpoint = await Endpoint.find(id)

    if (!endpoint) {
      throw new Error('ENDPOINT NOT FOUND')
    }

    endpoint.status = false

    await endpoint.save()

    return endpoint
  }
  public async enableEndpoint(id: number) {
    const endpoint = await Endpoint.find(id)
    if (!endpoint) {
      throw new Error('ENDPOINT NOT FOUND')
    }

    endpoint.status = true

    await endpoint.save()

    return endpoint
  }

public async getAccessDetails(data: any) {
  const includeAll = data.include === 'all'

  const endpoint = await Endpoint.query()
    .where('serviceId', data.serviceId)
    .where('method', data.method)
    .where('route', data.route)
    .first()

  if (!endpoint) {
    throw new Error('ENDPOINT NOT FOUND')
  }

  const query = Database.from('assigned_endpoints')
    .innerJoin(
      'permissions',
      'assigned_endpoints.permissionKey',
      'permissions.key'
    )
    .innerJoin(
      'assigned_permissions',
      'permissions.key',
      'assigned_permissions.permissionKey'
    )
    .innerJoin(
      'roles',
      'assigned_permissions.roleKey',
      'roles.key'
    )
    .innerJoin(
      'assigned_roles',
      'roles.key',
      'assigned_roles.roleKey'
    )
    .where('assigned_endpoints.endpointId', endpoint.id)
    console.table(query)
  if (!includeAll) {
    query
      .where('permissions.status', true)
      .where('roles.status', true)
  }

  const rows = await query.select(
    'permissions.key as permissionKey',
    'permissions.name as permissionName',
    'permissions.description as permissionDescription',
    'permissions.status as permissionStatus',

    'roles.key as roleKey',
    'roles.name as roleName',
    'roles.description as roleDescription',
    'roles.status as roleStatus',

    'assigned_roles.email'
  )

  const permissionsMap = new Map()
  const rolesMap = new Map()
  const usersSet = new Set()

  for (const row of rows) {
    permissionsMap.set(row.permissionKey, {
      key: row.permissionKey,
      name: row.permissionName,
      description: row.permissionDescription,
      status: row.permissionStatus,
    })

    rolesMap.set(row.roleKey, {
      key: row.roleKey,
      name: row.roleName,
      description: row.roleDescription,
      status: row.roleStatus,
    })

    usersSet.add(row.email)
  }

  return {
    endpoint,
    permissions: [...permissionsMap.values()],
    roles: [...rolesMap.values()],
    users: [...usersSet],
  }
}
}
