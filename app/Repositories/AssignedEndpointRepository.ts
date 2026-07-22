import AssignedEndpoint from 'App/Models/AssignedEndpoint'

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

    return await query
  }

  public static async getAssignedEndpoint(endpointId: number, permissionKey: string) {
    return await AssignedEndpoint.query()
      .where('endpointId', endpointId)
      .where('permissionKey', permissionKey)
      .preload('endpoint')
      .preload('permission')
      .first()
  }

  public static async create(data: any) {
    return await AssignedEndpoint.create(data)
  }

  public static async find(endpointId: number, permissionKey: string) {
    return await AssignedEndpoint.query()
      .where('endpointId', endpointId)
      .where('permissionKey', permissionKey)
      .first()
  }

  public static async update(assignedEndpoint: AssignedEndpoint, data: any) {
    assignedEndpoint.merge(data)
    await assignedEndpoint.save()
    return assignedEndpoint
  }

  public static async delete(assignedEndpoint: AssignedEndpoint) {
    await assignedEndpoint.delete()
  }
}
