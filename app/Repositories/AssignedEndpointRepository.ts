import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import { Exception } from '@adonisjs/core/build/standalone'
export default class AssignedEndpointRepository {
  public static async getAssignedEndpoints(sort?: string) {
    const query = AssignedEndpoint.query()
      .whereHas('endpoint', (query) => {
        query.where('status', true)
      })
      .whereHas('permission', (query) => {
        query.where('status', true)
      })
      .preload('endpoint')
      .preload('permission')

    const allowedSorts = ['endpointId', 'permissionKey']

    if (sort) {
      const direction = sort.startsWith('-') ? 'desc' : 'asc'
      const column = sort.startsWith('-') ? sort.substring(1) : sort

      if (allowedSorts.includes(column)) {
        query.orderBy(column, direction)
      }
    }
    query.limit(20)
    return query
  }

  public static async getAssignedEndpoint(endpointId: number, permissionKey: string) {
    const assigned_endpoint = await AssignedEndpoint.query()
      .where('endpointId', endpointId)
      .where('permissionKey', permissionKey)
      .preload('endpoint')
      .preload('permission')
      .first()
    if (!assigned_endpoint) {
      throw new Exception(
        'Assigned endpoint not found',
        404,
        'E_ASSIGNED_ENDPOINT_NOT_FOUND'
      )

    }
    return assigned_endpoint
  }

public static async create(data: any) {
  const assignedEndpoint = await AssignedEndpoint.query()
    .where('endpointId', data.endpointId)
    .where('permissionKey', data.permissionKey)
    .first()

  if (assignedEndpoint) {
    throw new Exception(
      'Assigned endpoint already exists',
      409,
      'E_ASSIGNED_ENDPOINT_EXISTS'
    )
  }

  return AssignedEndpoint.create(data)
}

  public static async find(endpointId: number, permissionKey: string) {
    const assigned_endpoint = await AssignedEndpoint.query()
      .where('endpointId', endpointId)
      .where('permissionKey', permissionKey)
      .first()
    if (!assigned_endpoint) {
      throw new Exception(
        'Assigned endpoint not found',
        404,
        'E_ASSIGNED_ENDPOINT_NOT_FOUND'
      )
    }
    return assigned_endpoint
  }

  public static async update(
    assignedEndpoint: AssignedEndpoint,
    data: any
  ) {
    const newEndpointId = data.endpointId ?? assignedEndpoint.endpointId
    const newPermissionKey = data.permissionKey ?? assignedEndpoint.permissionKey

    const exists = await AssignedEndpoint.query()
      .where('endpointId', newEndpointId)
      .where('permissionKey', newPermissionKey)
      .first()

    if (
      exists &&
      (
        exists.endpointId !== assignedEndpoint.endpointId ||
        exists.permissionKey !== assignedEndpoint.permissionKey
      )
    ) {
      throw new Exception(
        'Assigned endpoint already exists',
        409,
        'E_ASSIGNED_ENDPOINT_EXISTS'
      )
    }

    assignedEndpoint.merge(data)
    await assignedEndpoint.save()

    return assignedEndpoint
  }

  public static async delete(assignedEndpoint: AssignedEndpoint) {
    await assignedEndpoint.delete()
  }
}
