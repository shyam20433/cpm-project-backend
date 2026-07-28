import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'
import AssignedPermission from 'App/Models/AssignedPermission'
import AssignedRole from 'App/Models/AssignedRole'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

/* interface SetupRolePayload {
  role: {
    key: string
    name: string
    description: string
    status: boolean
  }
  permissions: string[]
  email: string
} */

export default class RoleRepository {
  public async getAll(filters: any) {
    const { include, sort } = filters

    const query = Role.query()

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
    const role = await Role.query().where('key', key).first()

    if (!role) {
      throw new Error('ROLE NOT FOUND')
    }

    return role
  }

  public async setupRole(
    data: any,
    trx: TransactionClientContract
  ) {
    const exists = await Role.query()
      .useTransaction(trx)
      .where('key', data.role.key)
      .first()

    if (exists) {
      throw new Error('Role already exists')
    }

    const role = await Role.create(data.role, {
      client: trx,
    })

    const permissions = [...new Set(data.permissions as string[])]



    for (const permissionKey of permissions) {

      const permission = await Permission.query()
        .useTransaction(trx)
        .where('key', permissionKey)
        .first()

      if (!permission) {
        throw new Error(`Permission '${permissionKey}' not found`)
      }

      await AssignedPermission.create(
        {
          roleKey: role.key,
          permissionKey,
        },
        {
          client: trx,
        }
      )
    }

    await AssignedRole.create(
      {
        roleKey: role.key,
        email: data.email,
      },
      {
        client: trx,
      }
    )

    return {
      role,
      permissions,
      email: data.email,
    }
  }

  public async createRole(data: any) {
    const exists = await Role.query().where('key', data.key).first()

    if (exists) {
      throw new Error('Role already exists')
    }

    return Role.create(data)
  }

  public async updateRole(key: string, data: any) {
    const role = await this.findByKey(key)

    role.merge(data)

    await role.save()

    return role
  }

  public async disableRole(key: string) {
    const role = await this.findByKey(key)

    role.status = false

    await role.save()

    return role
  }

  public async enableRole(key: string) {
    const role = await this.findByKey(key)

    role.status = true

    await role.save()

    return role
  }
}
