import AssignedRole from 'App/Models/AssignedRole'

export default class AssignedRoleRepository {
  public async getAll(sort?: string) {
    const query = AssignedRole.query()
      .whereHas('role', (query) => {
        query.where('status', true)
      })
      .preload('role')

    const allowedSorts = ['id', 'email', 'roleKey']

    if (sort) {
      const direction = sort.startsWith('-') ? 'desc' : 'asc'
      const column = sort.startsWith('-') ? sort.substring(1) : sort

      if (allowedSorts.includes(column)) {
        query.orderBy(column, direction)
      }
    }

    return await query
  }

  public async findById(id: number) {
    return await AssignedRole.find(id)
  }

  public async loadRole(assignedRole: AssignedRole) {
    await assignedRole.load('role')
    return assignedRole
  }

  public async createAssignedRole(data: any) {
    return await AssignedRole.create(data)
  }

  public async updateAssignedRole(id: number, data: any) {
    const assignedRole = await AssignedRole.find(id)

    if (!assignedRole) {
      return null
    }

    assignedRole.merge(data)

    await assignedRole.save()

    return assignedRole
  }

  public async deleteAssignedRole(id: number) {
    const assignedRole = await AssignedRole.find(id)

    if (!assignedRole) {
      return null
    }

    await assignedRole.delete()

    return assignedRole
  }
}
