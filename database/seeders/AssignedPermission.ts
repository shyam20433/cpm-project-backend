import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssignedPermission from 'App/Models/AssignedPermission'
export default class AssignedPermissionSeeder extends BaseSeeder {
  public async run() {
    await AssignedPermission.createMany([
      {
        roleKey: 'ADMIN',
        permissionKey: 'ORDER_READ'
      },
      {
        roleKey: 'ADMIN',
        permissionKey: 'ORDER_CREATE'
      },
      {
        roleKey: 'ADMIN',
        permissionKey: 'ORDER_UPDATE'
      },
      {
        roleKey: 'ADMIN',
        permissionKey: 'ORDER_DELETE'
      },
      {
        roleKey: 'MANAGER',
        permissionKey: 'ORDER_READ'
      },
      {
        roleKey: 'MANAGER',
        permissionKey: 'ORDER_CREATE'
      },
      {
        roleKey: 'MANAGER',
        permissionKey: 'ORDER_UPDATE'
      },
      {
        roleKey: 'EMPLOYEE',
        permissionKey: 'ORDER_READ'
      },
    ])
    // Write your database queries inside the run method
  }
}
