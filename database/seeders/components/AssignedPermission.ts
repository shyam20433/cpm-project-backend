import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssignedPermission from 'App/Models/AssignedPermission'

export default class AssignedPermissionSeeder extends BaseSeeder {
  public async run() {
    await AssignedPermission.updateOrCreateMany(
      ['roleKey', 'permissionKey'],
      [
        // ADMIN
        { roleKey: 'ADMIN', permissionKey: 'ENDPOINT_ACCESS_DETAILS' },
        { roleKey: 'ADMIN', permissionKey: 'ENDPOINT_READ' },
        { roleKey: 'ADMIN', permissionKey: 'ENDPOINT_CREATE' },
        { roleKey: 'ADMIN', permissionKey: 'ENDPOINT_UPDATE' },
        { roleKey: 'ADMIN', permissionKey: 'ENDPOINT_DELETE' },

        { roleKey: 'ADMIN', permissionKey: 'ROLE_READ' },
        { roleKey: 'ADMIN', permissionKey: 'ROLE_CREATE' },
        { roleKey: 'ADMIN', permissionKey: 'ROLE_UPDATE' },
        { roleKey: 'ADMIN', permissionKey: 'ROLE_DELETE' },

        { roleKey: 'ADMIN', permissionKey: 'PERMISSION_READ' },
        { roleKey: 'ADMIN', permissionKey: 'PERMISSION_CREATE' },
        { roleKey: 'ADMIN', permissionKey: 'PERMISSION_UPDATE' },
        { roleKey: 'ADMIN', permissionKey: 'PERMISSION_DELETE' },

        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ROLE_READ' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ROLE_CREATE' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ROLE_UPDATE' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ROLE_DELETE' },

        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_PERMISSION_READ' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_PERMISSION_CREATE' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_PERMISSION_UPDATE' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_PERMISSION_DELETE' },

        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ENDPOINT_READ' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ENDPOINT_CREATE' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ENDPOINT_UPDATE' },
        { roleKey: 'ADMIN', permissionKey: 'ASSIGNED_ENDPOINT_DELETE' },

        { roleKey: 'ADMIN', permissionKey: 'LOGIN' },

        // UPLOADER
        { roleKey: 'UPLOADER', permissionKey: 'ENDPOINT_CREATE' },
        { roleKey: 'UPLOADER', permissionKey: 'PERMISSION_CREATE' },
        { roleKey: 'UPLOADER', permissionKey: 'ROLE_CREATE' },
        { roleKey: 'UPLOADER', permissionKey: 'ASSIGNED_ROLE_CREATE' },
        { roleKey: 'UPLOADER', permissionKey: 'ASSIGNED_PERMISSION_CREATE' },
        { roleKey: 'UPLOADER', permissionKey: 'ASSIGNED_ENDPOINT_CREATE' },

        // MANAGER
        { roleKey: 'MANAGER', permissionKey: 'ENDPOINT_READ' },
        { roleKey: 'MANAGER', permissionKey: 'ENDPOINT_CREATE' },
        { roleKey: 'MANAGER', permissionKey: 'ENDPOINT_UPDATE' },

        { roleKey: 'MANAGER', permissionKey: 'ROLE_READ' },
        { roleKey: 'MANAGER', permissionKey: 'ROLE_CREATE' },
        { roleKey: 'MANAGER', permissionKey: 'ROLE_UPDATE' },

        { roleKey: 'MANAGER', permissionKey: 'PERMISSION_READ' },
        { roleKey: 'MANAGER', permissionKey: 'PERMISSION_CREATE' },
        { roleKey: 'MANAGER', permissionKey: 'PERMISSION_UPDATE' },
      ]
    )
  }
}
