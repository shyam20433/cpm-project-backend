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

    return  query
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

    return  Endpoint.create(data)
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
      throw new Error('ENDPOINT NOT FOUND')
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
