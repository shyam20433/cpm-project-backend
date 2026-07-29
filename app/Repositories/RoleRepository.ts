import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'
import AssignedPermission from 'App/Models/AssignedPermission'
import AssignedRole from 'App/Models/AssignedRole'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { Exception } from '@adonisjs/core/build/standalone'
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
      throw new Exception(
        'Role not found',
        404,
        'E_ROLE_NOT_FOUND'
      )
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
      throw new Exception(
        'Role already exists',
        409,
        'E_ROLE_EXISTS'
      )
    }

    const role = await Role.create(data.role, {
      client: trx,
    })

    const permissions = [...new Set(data.permissions as string[])]
    const permissionRecords = await Promise.all(
      permissions.map((permissionKey) =>
        Permission.query()
          .useTransaction(trx)
          .where('key', permissionKey)
          .first()
      )
    )
    permissionRecords.forEach((permission, index) => {
      if (!permission) {
        throw new Exception(
          `Permission '${permissions[index]}' not found`,
          404,
          'E_PERMISSION_NOT_FOUND'
        )
      }
    })
    await Promise.all(
      permissions.map((permissionKey) =>
        AssignedPermission.create(
          {
            roleKey: role.key,
            permissionKey,
          },
          {
            client: trx,
          }
        )
      )
    )
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
      throw new Exception(
  'Role already exists',
  409,
  'E_ROLE_EXISTS'
)
    }

    return Role.create(data)
  }

public async updateRole(key: string, data: any) {
  const role = await this.findByKey(key)

  const newKey = data.key ?? role.key

  const exists = await Role.query()
    .where('key', newKey)
    .first()

  if (exists && exists.key !== role.key) {
    throw new Exception(
      'Role already exists',
      409,
      'E_ROLE_EXISTS'
    )
  }

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
