import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'
import Endpoint from 'App/Models/Endpoint'
import AssignedPermission from 'App/Models/AssignedPermission'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'
import AssignedRole from 'App/Models/AssignedRole'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
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
    const roleExists = await Role.query()
      .useTransaction(trx)
      .where('key', data.role.key)
      .first()

    if (roleExists) {
      throw new Error('Role already exists')
    }

    const permissionExists = await Permission.query()
      .useTransaction(trx)
      .where('key', data.permission.key)
      .first()

    if (permissionExists) {
      throw new Error('Permission already exists')
    }

    const endpointExists = await Endpoint.query()
      .useTransaction(trx)
      .where('serviceId', data.endpoint.serviceId)
      .where('route', data.endpoint.route)
      .where('method', data.endpoint.method)
      .first()

    if (endpointExists) {
      throw new Error('Endpoint already exists')
    }

    const role = await Role.create(data.role, {
      client: trx,
    })

    const permission = await Permission.create(data.permission, {
      client: trx,
    })

    const endpoint = await Endpoint.create(data.endpoint, {
      client: trx,
    })


    await AssignedPermission.create(
      {
        roleKey: role.key,
        permissionKey: permission.key,
      },
      {
        client: trx,
      }
    )

    await AssignedEndpoint.create(
      {
        endpointId: endpoint.id,
        permissionKey: permission.key,
      },
      {
        client: trx,
      }
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
      permission,
      endpoint,
      email: data.email,
    }
  }
}
