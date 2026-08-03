/* import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'
import Endpoint from 'App/Models/Endpoint'
import AssignedPermission from 'App/Models/AssignedPermission'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { Exception } from '@adonisjs/core/build/standalone'

interface SetupAllPayload {
  roleKey: string[]

  permission: {
    key: string
    name: string
    description?: string
    status: boolean
  }

  endpoint: {
    serviceId: number
    route: string
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    status: boolean
  }
}

export default class RoleRepository {

  private normalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}
  public async setupAll(
    data: SetupAllPayload,
    trx: TransactionClientContract
  ) {
    data.permission.key = this.normalize(data.permission.key)
    data.permission.name = this.normalize(data.permission.name)
    data.permission.description = data.permission.description
      ?.trim()
      .replace(/\s+/g, ' ')

    data.endpoint.route = this.normalize(data.endpoint.route)
    const roleKeys = [...new Set(
      data.roleKey.map((role) => this.normalize(role))
    )]
    const [roles, permissionExists, endpointExists] = await Promise.all([
      Role.query()
        .whereIn('key', roleKeys),

      Permission.query()
        .where('key', data.permission.key)
        .first(),

      Endpoint.query()
        .where('serviceId', data.endpoint.serviceId)
        .where('route', data.endpoint.route)
        .where('method', data.endpoint.method).first(),
    ])
    //console.log(`checked roles,permissions,endpoints are exist ??`)

    if (roles.length !== roleKeys.length) {
      throw new Exception(
        'One or more roles not found',
        404,
        'E_ROLE_NOT_FOUND'
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

    const [permission, endpoint] = await Promise.all([


      Permission.create(data.permission, {
        client: trx,
      }),

      Endpoint.create(data.endpoint, {
        client: trx,
      }),
    ])
    //console.log(`Inserted Endpoints and Permissions`)

    const assignedPermissions = await Promise.all(
      roles.map((role) =>

        AssignedPermission.create(
          {
            roleKey: role.key,
            permissionKey: permission.key,
          },
          {
            client: trx,
          }
        )
      )
    )

    const assignedEndpoint = await AssignedEndpoint.create(
      {
        endpointId: endpoint.id,
        permissionKey: permission.key
      },
      {
        client: trx,
      }
    )
    return {
      rolesAssigned: assignedPermissions
        .map((assignedPermission) => assignedPermission.roleKey),

      permissionCreated: {
        key: assignedEndpoint.permissionKey,
        name: permission.name,
      },

      endpointCreated: {
        id: assignedEndpoint.endpointId,
        route: endpoint.route,
        method: endpoint.method,
      },
    }
  }
}
 */

import {
  TransactionClientContract,
} from '@ioc:Adonis/Lucid/Database'

interface SetupAllPayload {
  roleKey: string[]

  permission: {
    key: string
    name: string
    description?: string
    status: boolean
  }

  endpoint: {
    serviceId: number
    route: string
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    status: boolean
  }
}

export default class RoleRepository {
  private normalize(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
  }

  public async setupAll(
    data: SetupAllPayload,
    trx: TransactionClientContract
  ) {

    data.permission.key = this.normalize(data.permission.key)
    data.permission.name = this.normalize(data.permission.name)
    data.permission.description = data.permission.description
      ? this.normalize(data.permission.description)
      : undefined

    data.endpoint.route = this.normalize(data.endpoint.route)

    const roleKeys = [
      ...new Set(data.roleKey.map((role) => this.normalize(role))),
    ]

    try {

      await trx.rawQuery(
        `CALL setup_all(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          roleKeys,
          data.permission.key,
          data.permission.name,
          data.permission.description ?? '',
          data.permission.status,
          data.endpoint.serviceId,
          data.endpoint.route,
          data.endpoint.method,
          data.endpoint.status,
        ]
      )


      return {
        success: true,
        message: 'RBAC setup completed successfully.',
        data: {
          endpoint: {
            method: data.endpoint.method,
            route: data.endpoint.route,
            serviceId: data.endpoint.serviceId,
            status: data.endpoint.status,
          },
          permission: {
            key: data.permission.key,
            name: data.permission.name,
            description: data.permission.description,
            status: data.permission.status,
          },
          rolesAssigned: roleKeys,
        },
      }
    } catch (error) {
      throw error
    }
  }
}
