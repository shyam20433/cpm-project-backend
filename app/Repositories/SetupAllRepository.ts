import Role from 'App/Models/Role'
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
    description: string
    status: boolean
  }

  endpoint: {
    serviceId: number
    route: string
    method: string
    status: boolean
  }
}

export default class RoleRepository {
  public async setupAll(
    data: SetupAllPayload,
    trx: TransactionClientContract
  ) {
    const roleKeys = [...new Set(data.roleKey)]
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
        permissionKey: permission.key,
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

    /*   return {
        roles,
        permission,
        endpoint,
        assignedPermissions,
        assignedEndpoint,
      } */
  }
}
