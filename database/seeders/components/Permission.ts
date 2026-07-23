import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    await Permission.updateOrCreateMany(['key'], [
      {
        key: 'ENDPOINT_READ',
        name: 'Read Endpoint',
        description: 'Read endpoint',
        status: true,
      },
      {
        key: 'ENDPOINT_CREATE',
        name: 'Create Endpoint',
        description: 'Create endpoint',
        status: true,
      },
      {
        key: 'ENDPOINT_UPDATE',
        name: 'Update Endpoint',
        description: 'Update endpoint',
        status: true,
      },
      {
        key: 'ENDPOINT_DELETE',
        name: 'Delete Endpoint',
        description: 'Delete endpoint',
        status: true,
      },

      {
        key: 'ROLE_READ',
        name: 'Read Role',
        description: 'Read role',
        status: true,
      },
      {
        key: 'ROLE_CREATE',
        name: 'Create Role',
        description: 'Create role',
        status: true,
      },
      {
        key: 'ROLE_UPDATE',
        name: 'Update Role',
        description: 'Update role',
        status: true,
      },
      {
        key: 'ROLE_DELETE',
        name: 'Delete Role',
        description: 'Delete role',
        status: true,
      },

      {
        key: 'PERMISSION_READ',
        name: 'Read Permission',
        description: 'Read permission',
        status: true,
      },
      {
        key: 'PERMISSION_CREATE',
        name: 'Create Permission',
        description: 'Create permission',
        status: true,
      },
      {
        key: 'PERMISSION_UPDATE',
        name: 'Update Permission',
        description: 'Update permission',
        status: true,
      },
      {
        key: 'PERMISSION_DELETE',
        name: 'Delete Permission',
        description: 'Delete permission',
        status: true,
      },

      {
        key: 'ASSIGNED_ROLE_READ',
        name: 'Read Assigned Role',
        description: 'Read assigned role',
        status: true,
      },
      {
        key: 'ASSIGNED_ROLE_CREATE',
        name: 'Create Assigned Role',
        description: 'Create assigned role',
        status: true,
      },
      {
        key: 'ASSIGNED_ROLE_UPDATE',
        name: 'Update Assigned Role',
        description: 'Update assigned role',
        status: true,
      },
      {
        key: 'ASSIGNED_ROLE_DELETE',
        name: 'Delete Assigned Role',
        description: 'Delete assigned role',
        status: true,
      },

      {
        key: 'ASSIGNED_PERMISSION_READ',
        name: 'Read Assigned Permission',
        description: 'Read assigned permission',
        status: true,
      },
      {
        key: 'ASSIGNED_PERMISSION_CREATE',
        name: 'Create Assigned Permission',
        description: 'Create assigned permission',
        status: true,
      },
      {
        key: 'ASSIGNED_PERMISSION_UPDATE',
        name: 'Update Assigned Permission',
        description: 'Update assigned permission',
        status: true,
      },
      {
        key: 'ASSIGNED_PERMISSION_DELETE',
        name: 'Delete Assigned Permission',
        description: 'Delete assigned permission',
        status: true,
      },

      {
        key: 'ASSIGNED_ENDPOINT_READ',
        name: 'Read Assigned Endpoint',
        description: 'Read assigned endpoint',
        status: true,
      },
      {
        key: 'ASSIGNED_ENDPOINT_CREATE',
        name: 'Create Assigned Endpoint',
        description: 'Create assigned endpoint',
        status: true,
      },
      {
        key: 'ASSIGNED_ENDPOINT_UPDATE',
        name: 'Update Assigned Endpoint',
        description: 'Update assigned endpoint',
        status: true,
      },
      {
        key: 'ASSIGNED_ENDPOINT_DELETE',
        name: 'Delete Assigned Endpoint',
        description: 'Delete assigned endpoint',
        status: true,
      },

      {
        key: 'LOGIN',
        name: 'Login',
        description: 'User login',
        status: true,
      },
      {
        key: 'ENDPOINT_ACCESS_DETAILS',
        name: 'Read Endpoint Access Details',
        description: 'Read endpoint access details',
        status: true,
      },
    ])
  }
}
