import { Exception } from '@adonisjs/core/build/standalone'
import AssignedRole from 'App/Models/AssignedRole'

export default class AssignedRoleRepository {
  public getAll(sort?: string) {
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
    query.limit(20)
    return query
  }

  public async findById(id: number) {
    const assignedRole = await AssignedRole.findOrFail(id)
    return assignedRole
  }

  public async loadRole(assignedRole: AssignedRole) {
    await assignedRole.load('role')
    return assignedRole
  }

  public exists(roleKey: string, email: string) {
    return AssignedRole.query().where('roleKey', roleKey).where('email', email).first()
  }

  public async createAssignedRole(data: any) {
    const exists = await this.exists(data.roleKey, data.email)

    if (exists) {
      throw new Exception(
        'Assigned role already exists',
        409,
        'E_ASSIGNED_ROLE_EXISTS'
      )
    }

    return AssignedRole.create(data)
  }

  public async updateAssignedRole(assignedRole: AssignedRole, data: any) {
    const newRoleKey = data.roleKey ?? assignedRole.roleKey
    const newEmail = data.email ?? assignedRole.email

    const exists = await AssignedRole.query()
      .where('roleKey', newRoleKey)
      .where('email', newEmail)
      .first()

    if (
      exists &&
      exists.id !== assignedRole.id
    ) {
      throw new Exception(
        'Assigned role already exists',
        409,
        'E_ASSIGNED_ROLE_EXISTS'
      )
    }

    assignedRole.merge(data)
    await assignedRole.save()

    return assignedRole
  }

  public async deleteAssignedRole(assignedRole: AssignedRole) {



    await assignedRole.delete()

  }
}
