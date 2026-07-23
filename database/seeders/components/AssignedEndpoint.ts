import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'

export default class AssignedEndpointSeeder extends BaseSeeder {
  public async run() {
    await AssignedEndpoint.updateOrCreateMany(
      ['endpointId', 'permissionKey'],
      [
        { endpointId: 1, permissionKey: 'ENDPOINT_ACCESS_DETAILS' },

        { endpointId: 2, permissionKey: 'ENDPOINT_READ' },
        { endpointId: 3, permissionKey: 'ENDPOINT_READ' },
        { endpointId: 4, permissionKey: 'ENDPOINT_CREATE' },
        { endpointId: 5, permissionKey: 'ENDPOINT_UPDATE' },
        { endpointId: 6, permissionKey: 'ENDPOINT_DELETE' },

        { endpointId: 7, permissionKey: 'ROLE_READ' },
        { endpointId: 8, permissionKey: 'ROLE_READ' },
        { endpointId: 9, permissionKey: 'ROLE_CREATE' },
        { endpointId: 10, permissionKey: 'ROLE_UPDATE' },
        { endpointId: 11, permissionKey: 'ROLE_DELETE' },

        { endpointId: 12, permissionKey: 'PERMISSION_READ' },
        { endpointId: 13, permissionKey: 'PERMISSION_READ' },
        { endpointId: 14, permissionKey: 'PERMISSION_CREATE' },
        { endpointId: 15, permissionKey: 'PERMISSION_UPDATE' },
        { endpointId: 16, permissionKey: 'PERMISSION_DELETE' },

        { endpointId: 17, permissionKey: 'ASSIGNED_ROLE_READ' },
        { endpointId: 18, permissionKey: 'ASSIGNED_ROLE_READ' },
        { endpointId: 19, permissionKey: 'ASSIGNED_ROLE_CREATE' },
        { endpointId: 20, permissionKey: 'ASSIGNED_ROLE_UPDATE' },
        { endpointId: 21, permissionKey: 'ASSIGNED_ROLE_DELETE' },

        { endpointId: 22, permissionKey: 'ASSIGNED_PERMISSION_READ' },
        { endpointId: 23, permissionKey: 'ASSIGNED_PERMISSION_READ' },
        { endpointId: 24, permissionKey: 'ASSIGNED_PERMISSION_CREATE' },
        { endpointId: 25, permissionKey: 'ASSIGNED_PERMISSION_UPDATE' },
        { endpointId: 26, permissionKey: 'ASSIGNED_PERMISSION_DELETE' },

        { endpointId: 27, permissionKey: 'ASSIGNED_ENDPOINT_READ' },
        { endpointId: 28, permissionKey: 'ASSIGNED_ENDPOINT_READ' },
        { endpointId: 29, permissionKey: 'ASSIGNED_ENDPOINT_CREATE' },
        { endpointId: 30, permissionKey: 'ASSIGNED_ENDPOINT_UPDATE' },
        { endpointId: 31, permissionKey: 'ASSIGNED_ENDPOINT_DELETE' },

        { endpointId: 32, permissionKey: 'LOGIN' },
      ]
    )
  }
}
