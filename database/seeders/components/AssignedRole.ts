import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssignedRole from 'App/Models/AssignedRole'
export default class AssignedRoleSeeder extends BaseSeeder {
  public async run() {
    await AssignedRole.updateOrCreateMany('id', [
      {
        id: 1,
        roleKey: 'ADMIN',
        email: 'admin@company.com',
      },
      {
        id: 2,
        roleKey: 'MANAGER',
        email: 'manager@company.com',
      },
      {
        id: 3,
        roleKey: 'EMPLOYEE',
        email: 'employee@company.com',
      },
    ])
    // Write your database queries inside the run method
  }
}
