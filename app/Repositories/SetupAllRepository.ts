import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'
import Endpoint from 'App/Models/Endpoint'
import AssignedPermission from 'App/Models/AssignedPermission'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import AssignedRole from 'App/Models/AssignedRole'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { Exception } from '@adonisjs/core/build/standalone'
/*
interface SetupAllPayload {
  role: {
    key: string
    name: string
    description: string
    status: boolean
  }

  permission: {
    key: string
    name: string
    description: string
    status: boolean
  }

  endpoint: {
    serviceId: number
    route: string
    method: string
    status: boolean
  }

  email: string
} */

export default class RoleRepository {
  public async setupAll(
    data: any,
    trx: TransactionClientContract
  ) {
    const [roleExists, permissionExists, endpointExists] = await Promise.all([
      Role.query().where('key', data.role.key).first(),

      Permission.query().where('key', data.permission.key).first(),

      Endpoint.query().where('serviceId', data.endpoint.serviceId).where('route', data.endpoint.route)
        .where('method', data.endpoint.method).first(),
    ])

    if (roleExists) {
      throw new Exception(
        'Role already exists',
        409,
        'E_ROLE_EXISTS'
      )
    }

    if (permissionExists) {
      throw new Exception(
        'Permission already exists',
        409,
        'E_PERMISSION_EXISTS'
      )
    }

    if (endpointExists) {
      throw new Exception(
        'Endpoint already exists',
        409,
        'E_ENDPOINT_EXISTS'
      )
    }

    const [role, permission, endpoint] = await Promise.all([
      Role.create(data.role, {
        client: trx,
      }),

      Permission.create(data.permission, {
        client: trx,
      }),

      Endpoint.create(data.endpoint, {
        client: trx,
      }),
    ])

    await Promise.all([
      AssignedPermission.create(
        {
          roleKey: role.key,
          permissionKey: permission.key,
        },
        {
          client: trx,
        }
      ),

      AssignedEndpoint.create(
        {
          endpointId: endpoint.id,
          permissionKey: permission.key,
        },
        {
          client: trx,
        }
      ),

      AssignedRole.create(
        {
          roleKey: role.key,
          email: data.email,
        },
        {
          client: trx,
        }
      ),
    ])

    return {
      role,
      permission,
      endpoint,
      assignedPermission: {
        roleKey: role.key,
        permissionKey: permission.key,
      },
      assignedEndpoint: {
        endpointId: endpoint.id,
        permissionKey: permission.key,
      },
      assignedRole: {
        roleKey: role.key,
        email: data.email,
      },
    }
  }
}
