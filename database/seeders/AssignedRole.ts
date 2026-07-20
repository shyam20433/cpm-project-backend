import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssignedRole from 'App/Models/AssignedRole'
export default class AssignedRoleSeeder extends BaseSeeder {
  public async run() {
    await AssignedRole.createMany([
      {
        roleKey: 'ADMIN',
        email: 'admin@company.com'
      },
      {

        roleKey: 'MANAGER',
        email: 'manager@company.com'
      },
      {

        roleKey: 'EMPLOYEE',
        email: 'employee@company.com'
      },
    ])
    // Write your database queries inside the run method
  }
}
