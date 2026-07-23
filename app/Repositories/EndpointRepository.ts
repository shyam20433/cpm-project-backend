import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import AssignedPermission from 'App/Models/AssignedPermission'
import AssignedRole from 'App/Models/AssignedRole'
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
    query.limit(20)

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

    const assignedEndpoints = await AssignedEndpoint.query()
      .where('endpointId', endpoint.id)
      .preload('permission', (query) => {
        query.select('key', 'name', 'description', 'status')
      })

    const permissionKeys = assignedEndpoints.map((item) => item.permissionKey)

    const assignedPermissions = await AssignedPermission.query()
      .whereIn('permissionKey', permissionKeys)
      .preload('role', (query) => {
        query.select('key', 'name', 'description', 'status')
      })

    const roleKeys = [...new Set(assignedPermissions.map((item) => item.roleKey))]

    const assignedRoles = await AssignedRole.query()
      .whereIn('roleKey', roleKeys)
      .select('id', 'roleKey', 'email')

    const filteredAssignedEndpoints = includeAll
      ? assignedEndpoints
      : assignedEndpoints.filter((item) => item.permission.status)

    const filteredAssignedPermissions = includeAll
      ? assignedPermissions
      : assignedPermissions.filter((item) => item.role.status)

    const activeRoleKeys = new Set(filteredAssignedPermissions.map((item) => item.roleKey))

    const filteredAssignedRoles = includeAll
      ? assignedRoles
      : assignedRoles.filter((item) => activeRoleKeys.has(item.roleKey))

    return {
      endpoint,

      permissions: filteredAssignedEndpoints.map((item) => item.permission),

      roles: [...new Set(filteredAssignedPermissions.map((item) => item.role.key))],

      users: [...new Set(filteredAssignedRoles.map((item) => item.email))],
    }
  }
}
